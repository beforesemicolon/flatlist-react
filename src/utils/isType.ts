import getType, {types} from './getType';

export const isBoolean = (x: any): boolean => getType(x) === types.BOOLEAN;

export const isNumber = (x: any): boolean => getType(x) === types.NUMBER;

export const isNumeric = (x: any): boolean => !(isNaN(x)) && isFinite(x) && isNumber(x);

export const isObject = (x: any): boolean => getType(x) === types.OBJECT;

export const isObjectLiteral = (x: any): boolean => isObject(x) && (x.constructor === Object);

export const isString = (x: any): boolean => getType(x) === types.STRING || x instanceof String;

export const isArray = (x: any): boolean => getType(x) === types.ARRAY;

export const isNil = (x: any): boolean => (x === null || getType(x) === types.UNDEFINED);

export const isEmpty = (x: any): boolean => (
    ((isString(x) || isArray(x)) && x.length === 0)
    || (isObject(x) && Object.keys(x).length === 0)
    || (getType(x) === types.MAP && x.size === 0)
    || (getType(x) === types.SET && x.size === 0)
    || (getType(x) === types.NUMBER && isNaN(x))
);

export const isNilOrEmpty = (x: any): boolean => (
    isNil(x) || isEmpty(x)
);

export const isFunction = (x: any): boolean => getType(x) === types.FUNCTION;

export default {
    isArray,
    isFunction,
    isNil,
    isEmpty,
    isNilOrEmpty,
    isNumber,
    isObject,
    isString
};
