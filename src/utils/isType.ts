import getType, {types} from './getType';

export const isBoolean = (x: any): boolean => {
    return getType(x) === types.BOOLEAN;
};

export const isNumber = (x: any): boolean => {
    return getType(x) === types.NUMBER;
};

export const isNumeric = (x: any): boolean => {
    return !(isNaN(x)) && isFinite(x) && isNumber(x);
};

export const isObject = (x: any): boolean => {
    return getType(x) === types.OBJECT;
};

export const isObjectLiteral = (x: any): boolean => {
    return isObject(x) && (x.constructor === Object);
};

export const isString = (x: any): boolean => {
    return getType(x) === types.STRING || x instanceof String;
};

export const isArray = (x: any): boolean => {
    return getType(x) === types.ARRAY;
};

export const isNilOrEmpty = (x: any): boolean => {
    return (x === null ||
        getType(x) === types.UNDEFINED ||
        ((isString(x) || isArray(x)) && x.length === 0) ||
        (isObject(x) && Object.keys(x).length === 0) ||
        (isNumber(x) && x === 0)
    );
};

export const isFunction = (x: any): boolean => {
    return getType(x) === types.FUNCTION;
};

export default {
    isArray,
    isFunction,
    isNilOrEmpty,
    isNumber,
    isObject,
    isString,
};
