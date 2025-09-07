"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterBuilder = void 0;
const _DATE = 'Date';
class FilterBuilder {
    constructor() {
        this.filters = [];
    }
    static verifyFieldIsString(field) {
        if (typeof field !== 'string')
            throw new TypeError('field must be a string');
    }
    static verifyListOfSingularType(value, allowedTypes) {
        if (value.length === 0)
            throw new TypeError('value cannot be an empty list');
        const firstType = typeof value[0];
        value.forEach((item) => {
            if (typeof item !== firstType) {
                throw new TypeError('All items in value must be of the same type');
            }
        });
    }
    static verifyValueIsAllowedType(value, allowedTypes, allowArray) {
        let errorMessage = "";
        let typeCheckValue = value;
        if (allowArray && Array.isArray(value)) {
            FilterBuilder.verifyListOfSingularType(value, allowedTypes);
            errorMessage = "Items in ";
            typeCheckValue = value[0];
        }
        const isDateAndDateAllowed = allowedTypes.includes(_DATE) && typeCheckValue instanceof Date;
        const isAllowedType = allowedTypes.includes(typeof typeCheckValue);
        if (!(isDateAndDateAllowed || isAllowedType)) {
            throw new TypeError(`${errorMessage}value must be one of the following types: ${allowedTypes.join(', ')}`);
        }
    }
    static adjustValue(value) {
        const _adjustValue = (value) => {
            if (value instanceof Date) {
                return value.toISOString();
            }
            else if (typeof value === 'string') {
                return JSON.stringify(value);
            }
            return value;
        };
        if (Array.isArray(value)) {
            return `[${value.map(_adjustValue)}]`;
        }
        else {
            return _adjustValue(value);
        }
    }
    addValueFilter(allowedTypes, operator, field, value, allowArray = false) {
        FilterBuilder.verifyFieldIsString(field);
        FilterBuilder.verifyValueIsAllowedType(value, allowedTypes, allowArray);
        this.filters.push(`${operator}(${field},${FilterBuilder.adjustValue(value)})`);
    }
    equals(field, value) {
        const allowedTypes = ['boolean', 'number', 'string', _DATE];
        this.addValueFilter(allowedTypes, 'equals', field, value, true);
        return this;
    }
    lessThan(field, value) {
        this.addValueFilter(['number', _DATE], 'less-than', field, value);
        return this;
    }
    greaterThan(field, value) {
        this.addValueFilter(['number', _DATE], 'greater-than', field, value);
        return this;
    }
    lessOrEqual(field, value) {
        this.addValueFilter(['number', _DATE], 'less-or-equal', field, value);
        return this;
    }
    greaterOrEqual(field, value) {
        this.addValueFilter(['number', _DATE], 'greater-or-equal', field, value);
        return this;
    }
    contains(field, value) {
        this.addValueFilter(['string'], 'contains', field, value, true);
        return this;
    }
    containsAny(field, value) {
        this.addValueFilter(['string'], 'contains-any', field, value, true);
        return this;
    }
    containsAll(field, value) {
        this.addValueFilter(['string'], 'contains-all', field, value, true);
        return this;
    }
    endsWith(field, value) {
        this.addValueFilter(['string'], 'ends-with', field, value);
        return this;
    }
    startsWith(field, value) {
        this.addValueFilter(['string'], 'starts-with', field, value);
        return this;
    }
    any(field, value) {
        if (!Array.isArray(value)) {
            throw new TypeError('value must be an array');
        }
        const allowedTypes = ['boolean', 'number', 'string', _DATE];
        this.addValueFilter(allowedTypes, 'any', field, value, true);
        return this;
    }
    has(field) {
        FilterBuilder.verifyFieldIsString(field);
        this.filters.push(`has(${field})`);
        return this;
    }
    build() {
        return this.filters.join(',');
    }
}
exports.FilterBuilder = FilterBuilder;
//# sourceMappingURL=filterBuilder.js.map