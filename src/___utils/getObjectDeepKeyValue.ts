import getType, {types} from './getType';
import {isObject, isArray, isString} from './isType';
import convertMapToObject from './convertMapToObject';

const convertAnythingToArrayOrObject = (obj: any) => (getType(obj) === types.SET
    ? Array.from(obj) : getType(obj) === types.MAP
        ? convertMapToObject(obj) : (isObject(obj) || isArray(obj))
            ? obj : {});

const getObjectDeepKeyValue = (value: any, dotSeparatedKeys: string) => {
    let convertedValue = convertAnythingToArrayOrObject(value);
    let convertedValueType = '';

    if (isString(dotSeparatedKeys)) {
        const keys: any[] = dotSeparatedKeys.split('.');

        for (let i = 0; i < keys.length; i += 1) {
            const key = keys[i];
            if (convertedValue[key] === undefined) {
                console.error(`Key "${key}" was not found in`, value);
                convertedValue = null;
                break;
            }

            if (getType(convertedValue[key]) === types.SET) {
                convertedValue = Array.from(convertedValue[key]);
                convertedValueType = types.SET;
            } else if (getType(convertedValue[key]) === types.MAP) {
                convertedValue = convertMapToObject(convertedValue[key]);
                convertedValueType = types.MAP;
            } else {
                convertedValue = convertedValue[key];
                convertedValueType = '';
            }
        }

        // convert convertedValue to its original form
        return convertedValueType === types.SET
            ? new Set(convertedValue) : convertedValueType === types.MAP
                ? new Map(Object.entries(convertedValue)) : convertedValue;
    }

    throw new Error('getObjectDeepKeyValue: "dotSeparatedKeys" is not a dot separated values string');
};

export default getObjectDeepKeyValue;
