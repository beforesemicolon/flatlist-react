import filterList from './filterList';
import getObjectDeepKeyValue from './getObjectDeepKeyValue';
import {isArray, isFunction, isObject} from './isType';

export interface SearchOptionsInterface<T> {
    term?: string;
    everyWord?: boolean;
    caseInsensitive?: boolean;
    by?: string | ((item: T, term: string, idx: number) => boolean);
}

const defaultSearchOptions = {
    by: '',
    caseInsensitive: false,
    everyWord: false,
    term: ''
};

const getFilterByFn = <T>(term: string, by: SearchOptionsInterface<T>['by'], caseInsensitive = false): (item: T, idx: number) => boolean => {
    term = (caseInsensitive ? term.toLowerCase() : term).trim();

    if (isFunction(by)) {
        return (item: T, idx: number) => (by as (item: T, term: string, idx: number) => boolean)(item, term, idx);
    }

    return (item: T) => {
        const keyValue = (isObject(item) || isArray(item))
            ? getObjectDeepKeyValue(by as string, item as T)
            : item;

        const value = caseInsensitive ? `${keyValue}`.toLowerCase() : `${keyValue}`;

        return value.search(term) >= 0;
    };
};

const searchList = <T>(list: T[], options: SearchOptionsInterface<T>): T[] => {
    if (!isObject(options) || Object.keys(options).length === 0) {
        options = defaultSearchOptions as SearchOptionsInterface<T>;
    }

    if (list.length > 0) {
        const {term, by} = options;

        if (term && by && term.length >= 3) {
            const {everyWord, caseInsensitive} = options;

            if (everyWord) {
                const termWords = term.trim().split(/\s+/).filter((word: string) => (word.length >= 3));

                if (termWords.length > 0) {
                    const searchedList: Set<T> = new Set([]);

                    termWords.forEach((word) => {
                        const filterByFn = getFilterByFn(word, by, caseInsensitive);

                        filterList(list, filterByFn).forEach((item: T) => searchedList.add(item));
                    });

                    return Array.from(searchedList);
                }
            } else {
                const filterByFn = getFilterByFn(term, by, caseInsensitive);

                return filterList(list, filterByFn);
            }
        }
    }

    return list;
};

export default searchList;
