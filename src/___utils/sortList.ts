import getObjectDeepKeyValue from './getObjectDeepKeyValue';
import {isString, isObject, isArray, isNilOrEmpty} from './isType';

export interface SortOptionsInterface {
    by?: string | Array<string | { key: string; descending?: boolean; caseInsensitive?: boolean }>;
    descending?: boolean;
    caseInsensitive?: boolean;
}

const defaultSortOptions: SortOptionsInterface = {
    caseInsensitive: false,
    descending: false,
    by: ''
};

const compareKeys = (first: any, second: any,
    {key = '', caseInsensitive = false, descending = false}: any) => {
    // console.log('-- compareKeys', key);
    if (key) {
        first = (isObject(first) || isArray(first)) ? getObjectDeepKeyValue(first, (key as string)) : first;
        second = (isObject(second) || isArray(second)) ? getObjectDeepKeyValue(second, (key as string)) : second;
    }

    if (caseInsensitive) {
        first = isString(first) ? first.toLowerCase() : first;
        second = isString(second) ? second.toLowerCase() : second;
    }

    return first > second ? (descending ? -1 : 1)
        : first < second ? (descending ? 1 : -1)
            : 0;
};

const sortList = <T>(list: T[], options: SortOptionsInterface = defaultSortOptions): T[] => {
    const listCopy = [...list];

    if (isNilOrEmpty(options)) {
        options = defaultSortOptions;
    }

    options = {...defaultSortOptions, ...options};

    listCopy.sort((first: any, second: any) => {
        if (isArray(options.by)) {
            for (let i = 0; i < (options.by as []).length; i += 1) {
                const key = (options.by as [])[i];
                const option = isObject(key) ? key : {...options, key};
                // console.log('-- option', key, isObject(key), option);
                const res = compareKeys(first, second, option);

                if (res !== 0) {
                    return res;
                }
            }

            return 0;
        }

        return compareKeys(first, second, {...options, key: options.by});
    });

    return listCopy;
};

export default sortList;
