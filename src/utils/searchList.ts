import filterList from './filterList';
import getObjectDeepKeyValue from './getObjectDeepKeyValue';
import {isArray, isFunction, isObject} from './isType';

export interface SearchOptionsInterface {
    term?: string;
    everyWord?: boolean;
    caseInsensitive?: boolean;
    by?: string | ((item: any, term: string, idx: number) => boolean);
}

const defaultSearchOptions: SearchOptionsInterface = {
    by: '',
    caseInsensitive: false,
    everyWord: false,
    term: ''
};

const getFilterByFn = (term: string, by: SearchOptionsInterface['by'], caseInsensitive: boolean = false) => {
    if (isFunction(by)) {
        return (item: any, idx: number) => {
            return (by as (item: any, term: string, idx: number) => boolean)(item, term, idx);
        };
    }

    return (item: any) => {
        const keyValue = (isObject(item) || isArray(item)) ?
            getObjectDeepKeyValue(by as string, item) :
            item;

        term = (caseInsensitive ? term.toLowerCase() : term).trim();
        const value = caseInsensitive ? `${keyValue}`.toLowerCase() : `${keyValue}`;

        return value.search(term) >= 0;
    };
};

const searchList = <T>(list: T[], options: SearchOptionsInterface) => {

    if (!isObject(options) || Object.keys(options).length === 0) {
        options = defaultSearchOptions;
    }

    if (list.length > 0) {
        const {term, by} = options;

        if (term && by && term.length >= 3) {
            const {everyWord, caseInsensitive} = options;

            if (everyWord) {
                const termWords = term.trim().split(/\s+/).filter((word: string) => (word.length >= 3));

                if (termWords.length > 0) {
                    const searchedList: Set<any> = new Set([]);

                    termWords.forEach((word) => {
                        const filterByFn = getFilterByFn(word, by as string, caseInsensitive);

                        filterList(list, filterByFn).forEach((item: any) => searchedList.add(item));
                    });

                    return Array.from(searchedList);
                }
            } else {
                const filterByFn = getFilterByFn(term, by as string, caseInsensitive);

                return filterList(list, filterByFn);
            }
        }
    }

    return list;
};

export default searchList;
