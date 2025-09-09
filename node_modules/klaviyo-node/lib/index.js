/** @module klaviyo-node */
const winston = require('winston');
const {format} = winston;
const {assign, isUndefined, get} = require('lodash');
const axios = require('axios');
const assert = require('assert');
const axiosRetry = require('axios-retry');

/**
 * A Class for Klaviyo tracking. This class creates an object that
 * makes it easy to send Server-Side events to Klaviyo. More
 * documentation about Klaviyo Server-Side events can be found
 * here: https://www.klaviyo.com/docs/http-api
 */
class Klaviyo {
  /**
   * Initialize a new `Klaviyo` with the Klaviyo public key and an
   * optional dictionary of `options`.
   * @constructor
   *
   * @param {String} publicKey - The public key that comes with every
   * Klaviyo account.
   * @param {Object} [options] (optional)
   *   @property {Winston.Transport} transport (default: Console) - A
   *       Winston Logger Transport object. When a Transport is passed, all
   *       log messages will be forwarded to that transport instead of the
   *       default Console output.
   *   @property {Boolean} log (default: true) - If true, this module
   *       will output log messages using the defined or default Transport
   *   @property {String} logLevel (default: info) - Decide which level
   *       log messages should be outputted for.
   *   @property {String} apiBasePath (default: https://a.klaviyo.com/api) -
   *       The base URL to which to send the track and identify calls to.
   */
  constructor(publicKey, options) {
    options = options || {};

    assert(publicKey, 'You must pass your Klaviyo public key.');

    this.publicKey = publicKey;

    const defaultTransport = new winston.transports.Console({
      format: winston.format.combine(
          format.colorize(),
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.align(),
          format.printf(
              (info) => `${info.timestamp} ${info.level}: ${info.message}`
          )
      ),
    });

    const defaultOptions = {
      log: true,
      logLevel: 'info',
      transport: defaultTransport,
      apiBasePath: 'https://a.klaviyo.com/api',
      retryCount: 3,
    };

    options = assign(defaultOptions, options);
    this.logger = {
      log: () => {},
    };

    this.apiBasePath = options.apiBasePath;

    if ( options.log ) {
      this.logger = winston.createLogger({
        level: options.logLevel,
        format: winston.format.json(),
        transports: [
          options.transport,
        ],
      });
    }
    axiosRetry(axios, {
      retries: options.retryCount,
      retryCondition: this._isErrorRetryable,
      retryDelay: axiosRetry.exponentialDelay,
    });
  }

  /**
   * Function that defines when a Request should be retried by Axios
   * @private
   * @param {Error} error - An Axios error response
   * @return {Boolean} - True if a Request should be retried
   */
  _isErrorRetryable(error) {
    // Retry Network Errors.
    if (axiosRetry.isNetworkError(error)) {
      return true;
    }

    if (!error.response) {
      // Cannot determine if the request can be retried
      return false;
    }

    // Retry Server Errors (5xx).
    if (error.response.status >= 500 && error.response.status <= 599) {
      return true;
    }

    // Retry if rate limited.
    if (error.response.status === 429) {
      return true;
    }

    return false;
  }

  /**
   * A helper function that sends data to Klaviyo. This is used by the
   * track and identify function to send the events.
   * @private
   * @param {String} verb - The type of Klaviyo request (track/identify)
   * @param {Object} data - An object that represents the Klaviyo event
   * @return {String} - The string "foo"
   */
  _requestKlaviyo(verb, data) {
    assert(verb === 'identify' || verb === 'track', `${verb} is not a \
      supported Klaviyo even type`);

    assert(!isUndefined(data), `_requestKlaviyo can't be called without \
      an event object`);
    const endpoint = `${this.apiBasePath}/${verb}`;
    data['token'] = this.publicKey;
    const payload = Buffer.from(JSON.stringify(data)).toString('base64');

    this.logger.log('info', endpoint);
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: endpoint,
        params: {
          'data': payload,
        },
      })
          .then((response) => {
            if (response.data === 0) {
              this.logger.log('warn', `Klaviyo rejected the \
                track request`, data);
            } else {
              this.logger.log('verbose', `Successfully sent an event to \
                Klaviyo`, data);
            }
            resolve(response.data);
          })
          .catch((error) => {
            const status = get(error, 'response.status', 'Unkown Status');
            this.logger.log('error', `Encountered ${status} \
              from GET to ${endpoint}`, payload);
            reject(error);
          });
    });
  }

  /**
   * Used to track when someone takes an action or does something.
   * @param {String} eventName - The type of Klaviyo request (track/identify)
   * @param {String} email - The email that acts as a unique identified
   *     for this user
   * @param {Object} [eventProperties={}] - Custom information about the
   * person who did this event.
   * @param {Object} [customerProperties={}] - Custom information about this
   *     event.
   * @return {Promise} Returns a Promise with the result of the Klaviyo
   *     request.
   */
  track(eventName, email, eventProperties={}, customerProperties={}) {
    this.logger.log('verbose', `Sending Klaviyo a track event ${eventName} \
      for user ${email}`);
    assert(email, 'You must pass an email value.');

    customerProperties['$email'] = email;
    const data = {
      'event': eventName,
      'properties': eventProperties,
      'customer_properties': customerProperties,
    };

    return this._requestKlaviyo('track', data);
  }

  /**
   * The identify method allows you to identify and set properties on
   * an individual.
   * @param {String} email - The email that acts as a unique identified
   *     for this user
   * @param {Object} [customerProperties={}] - Custom information about
   *     the person who did this event.
   * @return {Promise} Returns a Promise with the result of the Klaviyo
   *     request.
   */
  identify(email, customerProperties={}) {
    this.logger.log('verbose', `Sending Klaviyo an identify event \
      for user ${email}`);
    assert(email, 'You must pass an email value.');

    customerProperties['$email'] = email;

    const data = {
      'properties': customerProperties,
    };

    return this._requestKlaviyo('identify', data);
  }
}

module.exports = Klaviyo;
