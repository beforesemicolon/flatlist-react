import getType, {types} from './getType';

export const isNumber = (x: any): boolean => {
    return getType(x) === types.NUMBER && isFinite(x);
};

export const isObject = (x: any): boolean => {
    return getType(x) === types.OBJECT;
};

export const isString = (x: any): boolean => {
    return getType(x) === types.STRING || x instanceof String;
};

export const isArray = (x: any): boolean => {
    return getType(x) === types.ARRAY;
};

export const isNil = (x: any): boolean => {
    return (x === null ||
        getType(x) === types.UNDEFINED ||
        ((isString(x) || isArray(x)) && x.length === 0) ||
        (isObject(x) && Object.keys(x).length === 0)
    );
};

export const isFunction = (x: any): boolean => {
    return getType(x) === types.FUNCTION;
};

export default {
    isNumber,
    isObject,
    isString,
    isArray,
    isNil,
    isFunction
};
