import getObjectDeepKeyValue from './getObjectDeepKeyValue';
import {isString, isObject, isArray, isNilOrEmpty} from './isType';

export interface SortOptionsInterface {
    onKey?: string;
    descending?: boolean;
    caseInsensitive?: boolean;
}

const defaultSortOptions: SortOptionsInterface = {
    caseInsensitive: false,
    descending: false,
    onKey: ''
};

const sortList = <T>(list: T[], options: SortOptionsInterface = defaultSortOptions): T[] => {
    const listCopy = [...list];

    if (isNilOrEmpty(options)) {
        options = defaultSortOptions;
    }

    options = {...defaultSortOptions, ...options};

    listCopy.sort((first: any, second: any) => {
        if (options.onKey) {
            first = (isObject(first) || isArray(first)) ? getObjectDeepKeyValue(options.onKey, first) : first;
            second = (isObject(second) || isArray(second)) ? getObjectDeepKeyValue(options.onKey, second) : second;
        }

        if (options.caseInsensitive) {
            first = isString(first) ? first.toLowerCase() : first;
            second = isString(second) ? second.toLowerCase() : second;
        }

        return first > second ? (options.descending ? -1 : 1)
            : first < second ? (options.descending ? 1 : -1)
                : 0;
    });

    return listCopy;
};

export default sortList;
