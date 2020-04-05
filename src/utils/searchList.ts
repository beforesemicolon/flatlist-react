import filterList from './filterList';
import getObjectDeepKeyValue from './getObjectDeepKeyValue';
import {isArray, isFunction, isObject, isNilOrEmpty} from './isType';

export interface SearchOptionsInterface<T> {
    term?: string;
    everyWord?: boolean;
    caseInsensitive?: boolean;
    minCharactersCount?: number;
    by?: string | string[] | {by: string; caseInsensitive?: boolean}[] | ((item: T, term: string, idx: number) => boolean);
}

const defaultSearchOptions = {
    by: '0',
    caseInsensitive: false,
    everyWord: false,
    minCharactersCount: 3,
    term: ''
};

const defaultFilterByFn = (item: any, term: string, caseInsensitive = false, by = '0') => {
    const keyValue = (isObject(item) || isArray(item))
        ? getObjectDeepKeyValue(by as string, item)
        : item;

    const value = caseInsensitive ? `${keyValue}`.toLowerCase() : `${keyValue}`;
    term = (caseInsensitive ? term.toLowerCase() : term).trim();

    return value.search(term) >= 0;
};

const getFilterByFn = <T>(term: string, by: SearchOptionsInterface<T>['by'], caseInsensitive = false): (item: T, idx: number) => boolean => {
    if (isFunction(by)) {
        return (item: T, idx: number) => (by as (item: T, term: string, idx: number) => boolean)(item, term, idx);
    }

    if (isArray(by)) {
        return (item: T) => (by as []).some((key: any) => {
            const keyCaseInsensitive = isObject(key) && key.caseInsensitive !== undefined
                ? key.caseInsensitive : caseInsensitive;
            const keyBy = (isObject(key) ? key.by : key) || '0';
            return defaultFilterByFn(item, term, keyCaseInsensitive, keyBy);
        });
    }

    return (item: T) => defaultFilterByFn(item, term, caseInsensitive, by as string || '0');
};

const searchList = <T>(list: T[], options: SearchOptionsInterface<T>): T[] => {
    if (isNilOrEmpty(options)) {
        options = defaultSearchOptions as SearchOptionsInterface<T>;
    }

    if (list.length > 0) {
        const {term, by = '0', minCharactersCount = 0} = options;

        if (term && by && (term.length >= minCharactersCount)) {
            const {everyWord, caseInsensitive} = options;

            if (everyWord) {
                const termWords = term
                    .trim()
                    .split(/\s+/)
                    .filter((word: string) => (word.length >= minCharactersCount));

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
