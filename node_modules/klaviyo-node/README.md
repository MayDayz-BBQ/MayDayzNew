# Klaviyo Node.js [![CircleCI](https://circleci.com/gh/itso-io/klaviyo-node.svg?style=svg)](https://circleci.com/gh/itso-io/klaviyo-node)
A third party maintained Node.js package for sending Klaviyo events

## What is Klaviyo?

Klaviyo is a real-time service for understanding your customers by aggregating all your customer data, identifying important groups of customers and then taking action.
http://www.klaviyo.com/

## What does this package do?

* Track customers and events directly from your backend.

## How to install?

    npm install klaviyo-node

## API Examples

After installing the klaviyo package you can initiate it using your public token which is for track events or identifying profiles and/or your private API key to utilize the metrics and list APIs.

    const Klaviyo = require('klaviyo-node');

    client = new Klaviyo(PUBLIC_TOKEN);

You can then easily use Klaviyo to track events or identify people.  Note, track and identify requests take your public token.

    // Track an event...
    client.track('Filled out profile', 'someone@mailinator.com', {
      'Added social accounts': false,
    });

    // you can also add profile properties
    client.track(
        'Filled out profile',
        'someone@mailinator.com',
        {
          'Added social accounts': false,
        },
        {
          '$first_name': 'Thomas',
          '$last_name': 'Jefferson',
        }
    );

    // ...or just add a property to someone
    client.identify('thomas.jefferson@mailinator.com', {
      '$first_name': 'Thomas',
      '$last_name': 'Jefferson',
      'Plan': 'Premium',
    });

More details about the Klaviyo API can be found here: https://www.klaviyo.com/docs/http-api

## Documentation
The methods in the package are documented in the [docs](https://github.com/itso-io/klaviyo-node/tree/master/docs) folder of the repository. 

## Contributing
Everyone is welcome to contribute to this package. Simply make sure there are no errors and your contribution passes the CircleCI test and we will review and hopefully merge your changes. 

This package uses `yarn` as a package manager, which provides several benefits over `npm`. After having run `npm install`, you should be able to use the `yarn` command in your CLI.

To make sure your package is ready for a Pull Request, please run `yarn build`. The build script will check styling, create documentation (you should check in the changes in the `/docs` folder) and check the spelling in your documentation.

### Testing
This package uses `jest` to run tests. You can easily run all the tests using `yarn test`.

### Style Guide
This package uses ESLint with the [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html). Styling is strictly enforced and CircleCI will return an error when there are styling issues with your contribution. You can run the linter by executing `yarn lint`.

### Documentation
The Google JavaScript Style Guide enforces that [JSDoc](https://developers.google.com/closure/compiler/docs/js-for-compiler) is used on all classes, fields, and methods. The JSDoc strings are used by `jsdoc-to-markdown` to generate documentation in `/docs`.

### Spelling
We like correct spelling even in documentation. A spellchecker is run on all markdown files, including the ones that were generated based on the JSDoc strings and a Pull Request will fail checks if there are spelling issues. The spellchecker doesn't recognize parameter, method, and class names and those obviously don't need to be English words. To make sure your new parameter, method, and class names are accepted by the spellchecker, you can run `yarn spelling` to interactively add these names to the local dictionary (`.spelling`).
