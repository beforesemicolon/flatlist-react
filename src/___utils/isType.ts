import getType, { types } from "./getType";

export const isBoolean = (x: any): x is boolean => getType(x) === types.BOOLEAN;

export const isNumber = (x: any): x is number =>
  getType(Number(x)) === types.NUMBER && !isNaN(Number(x));

export const isNumeric = (x: any): x is number => isFinite(x) && isNumber(x);

export const isObject = (x: any): x is object => getType(x) === types.OBJECT;

export const isObjectLiteral = (x: any): x is object =>
  isObject(x) && x.constructor === Object;

export const isString = (x: any): x is string =>
  getType(x) === types.STRING || x instanceof String;

export const isArray = (x: any): x is any[] => getType(x) === types.ARRAY;

export const isSet = (x: any): x is Set<any> => getType(x) === types.SET;

export const isMap = (x: any): x is Map<any, any> => getType(x) === types.MAP;

export const isNil = (x: any): x is null | undefined =>
  x === null || getType(x) === types.UNDEFINED;

export const isEmpty = (x: any): boolean =>
  ((isString(x) || isArray(x)) && x.length === 0) ||
  (isObject(x) && Object.keys(x).length === 0) ||
  (getType(x) === types.MAP && x.size === 0) ||
  (getType(x) === types.SET && x.size === 0) ||
  (getType(x) === types.NUMBER && isNaN(x));

export const isNilOrEmpty = (x: any): boolean => isNil(x) || isEmpty(x);

export const isFunction = (x: any): x is (...args: any[]) => any =>
  getType(x) === types.FUNCTION;

export default {
  isArray,
  isFunction,
  isNil,
  isEmpty,
  isNilOrEmpty,
  isNumber,
  isObject,
  isString,
  isSet,
  isMap,
};
