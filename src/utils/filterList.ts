import getObjectDeepKeyValue from './getObjectDeepKeyValue';
import {isObject, isFunction, isString, isArray} from './isType';

const filterList = <T>(list: T[], by: ((item: T, idx: number) => boolean) | string = ''): T[] => {
    const listCopy = [...list];

    return listCopy.filter((item: T, idx: number) => {
        if ((isString(by) && (isObject(item) || isArray(item)))) {
            return getObjectDeepKeyValue(by as string, item);
        }

        if (isFunction(by)) {
            return (by as (item: T, idx: number) => boolean)(item, idx);
        }

        return true;
    });
};

export default filterList;
