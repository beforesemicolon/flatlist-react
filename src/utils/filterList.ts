import getObjectDeepKeyValue from './getObjectDeepKeyValue';
import {isArray, isFunction, isObject, isString} from './isType';

const filterList = <T>(list: T[], by: ((item: T, idx: number) => boolean) | string = ''): T[] => {
    return list.filter((item: T, idx: number) => {
        if (isString(by) && (isObject(item) || isArray(item))) {
            return getObjectDeepKeyValue(by as string, item as T);
        }

        if (isFunction(by)) {
            return (by as (item: T, idx: number) => boolean)(item as T, idx);
        }

        return true;
    });
};

export default filterList;
