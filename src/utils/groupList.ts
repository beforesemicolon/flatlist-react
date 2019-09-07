import {isNumber, isObject, isFunction, isString} from './isType';
import getObjectDeepKeyValue from './getObjectDeepKeyValue';

export interface GroupOptionsInterface {
    by?: string;
    on?: ((item: any, idx: number) => string) | null;
    every?: number;
}

const defaultGroupOptions: GroupOptionsInterface = {
    by: '',
    every: 0,
    on: null
};

interface GroupedItemsObjectInterface<T> {
    [s: string]: T[];
}

const groupList = <T>(list: T[], options: GroupOptionsInterface = defaultGroupOptions) => {
    if (!isObject(options) || Object.keys(options).length === 0) {
        options = defaultGroupOptions;
    }

    options = {...defaultGroupOptions, ...options};

    if (options.by && isString(options.by)) {
        const groupedList: GroupedItemsObjectInterface<T> = list
            .reduce((prevList: GroupedItemsObjectInterface<T>, item: T): GroupedItemsObjectInterface<T> => {
                // @ts-ignore
                const groupLabel: string = getObjectDeepKeyValue(options.by, item);

                if (!prevList[groupLabel]) {
                    prevList[groupLabel] = [];
                }

                prevList[groupLabel].push(item);

                return prevList;
            }, {});

        return Object.values(groupedList);
    }

    if (options.on && isFunction(options.on)) {
        const groupedList: GroupedItemsObjectInterface<T> = list
            .reduce((prevList: GroupedItemsObjectInterface<T>, item: T, idx: number) => {
                // @ts-ignore
                const groupLabel: string = options.on(item, idx);

                if (!prevList[groupLabel]) {
                    prevList[groupLabel] = [];
                }

                prevList[groupLabel].push(item);

                return prevList;
            }, {});

        return Object.values(groupedList);
    }

    // @ts-ignore
    if (isNumber(options.every) && (options.every > 0)) {
        return list.reduce((groupedList: any[], item: T, idx: number) => {
            groupedList[groupedList.length - 1].push(item);

            const itemNumber: number = idx + 1;
            // @ts-ignore
            if (isNumber(options.every) && (options.every > 0) &&
                itemNumber < list.length && // make sure separator is not added at the end
                // @ts-ignore
                (itemNumber % options.every) === 0
            ) {
                groupedList.push([]);
            }

            return groupedList;
        }, [[]]);
    }

    return list;
};

export default groupList;
