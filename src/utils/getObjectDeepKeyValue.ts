import {isObject, isArray, isString} from './isType';

export interface StringObjectInterface<T> {
    [t: string]: StringObjectInterface<T> | T;
}

const getObjectDeepKeyValue = <T>(dotSeparatedKeys: string, objectOrArray: StringObjectInterface<T>): T | StringObjectInterface<T> => {
    if ((isObject(objectOrArray) || isArray(objectOrArray)) && isString(dotSeparatedKeys)) {
        const keys = dotSeparatedKeys.split('.');
        let value = objectOrArray;

        keys.forEach((key) => {
            if (value[key] === undefined) {
                throw new Error(`getObjectDeepKeyValue: "${key}" is undefined.`);
            } else {
                value = value[key] as StringObjectInterface<T>;
            }
        });

        return value;
    }

    throw new Error('getObjectDeepKeyValue: "dotSeparatedKeys" is not a string or "objectOrArray" is not an object or array.');
};

export default getObjectDeepKeyValue;
