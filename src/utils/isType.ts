import getType, {types} from './getType';

export const isBoolean = (x: any): boolean => getType(x) === types.BOOLEAN;

export const isNumber = (x: any): boolean => getType(x) === types.NUMBER;

// eslint-disable-next-line no-restricted-globals
export const isNumeric = (x: any): boolean => !(isNaN(x)) && isFinite(x) && isNumber(x);

export const isObject = (x: any): boolean => getType(x) === types.OBJECT;

export const isObjectLiteral = (x: any): boolean => isObject(x) && (x.constructor === Object);

export const isString = (x: any): boolean => getType(x) === types.STRING || x instanceof String;

export const isArray = (x: any): boolean => getType(x) === types.ARRAY;

export const isNilOrEmpty = (x: any): boolean => (x === null
        || getType(x) === types.UNDEFINED
        || ((isString(x) || isArray(x)) && x.length === 0)
        || (isObject(x) && Object.keys(x).length === 0)
        || (isNumber(x) && x === 0)
);

export const isFunction = (x: any): boolean => getType(x) === types.FUNCTION;

export default {
    isArray,
    isFunction,
    isNilOrEmpty,
    isNumber,
    isObject,
    isString
};
