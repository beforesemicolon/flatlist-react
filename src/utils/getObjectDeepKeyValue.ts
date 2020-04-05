import {isObject, isArray, isString} from './isType';

const getObjectDeepKeyValue = (dotSeparatedKeys: string, objectOrArray: any) => {
    if ((isObject(objectOrArray) || isArray(objectOrArray)) && isString(dotSeparatedKeys)) {
        const keys: string[] = dotSeparatedKeys.split('.');
        let value = objectOrArray;

        keys.forEach((key: string) => {
            if (value[key] === undefined) {
                throw new Error(`getObjectDeepKeyValue: "${key}" is undefined.`);
            } else {
                value = value[key];
            }
        });

        return value;
    }

    throw new Error('getObjectDeepKeyValue: "dotSeparatedKeys" is not a string or "objectOrArray" is not an object or array.');
};

export default getObjectDeepKeyValue;
