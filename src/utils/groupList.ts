import {isNumber, isObject, isFunction, isString} from './isType';
import getObjectDeepKeyValue from './getObjectDeepKeyValue';

export interface GroupOptionsInterface {
    by?: string;
    on?: ((item: any, idx: number) => string) | undefined;
    every?: number;
    max?: number;
}

const defaultGroupOptions: GroupOptionsInterface = {
    by: '',
    every: 0,
    max: 0,
    on: undefined,
};

interface GroupedItemsObjectInterface<T> {
    [s: string]: T[];
}

const groupList = <T>(list: T[], options: GroupOptionsInterface = defaultGroupOptions) => {
    const groupLabels: Set<string> = new Set([]);

    if (!isObject(options) || Object.keys(options).length === 0) {
        options = defaultGroupOptions;
    }

    options = {...defaultGroupOptions, ...options};

    if (options.by && isString(options.by)) {
        const groupedList: GroupedItemsObjectInterface<T> = list
            .reduce((prevList: GroupedItemsObjectInterface<T>, item: T): GroupedItemsObjectInterface<T> => {
                const groupLabel = getObjectDeepKeyValue(options.by, item);
                groupLabels.add(groupLabel);

                if (!prevList[groupLabel]) {
                    prevList[groupLabel] = [];
                }

                if (!options.max || prevList[groupLabel].length < options.max) {
                    prevList[groupLabel].push(item);
                }

                return prevList;
            }, {});

        return {
            groupLabels: Array.from(groupLabels),
            list: Object.values(groupedList)
        };
    }

    if (options.on as (item: any, idx: number) => string && isFunction(options.on)) {
        const groupedList: GroupedItemsObjectInterface<T> = list
            .reduce((prevList: GroupedItemsObjectInterface<T>, item: T, idx: number) => {
                const on: GroupOptionsInterface['on'] = options.on as (item: any, idx: number) => string;
                const groupLabel: string = on(item, idx);
                groupLabels.add(groupLabel);

                if (!prevList[groupLabel]) {
                    prevList[groupLabel] = [];
                }

                if (!options.max || prevList[groupLabel].length < options.max) {
                    prevList[groupLabel].push(item);
                }

                return prevList;
            }, {});

        return {
            groupLabels: Array.from(groupLabels),
            list: Object.values(groupedList)
        };
    }

    if (options.every && isNumber(options.every) && (options.every > 0)) {
        return {
            groupLabels: Array.from(groupLabels),
            list: list.reduce((groupedList: any[], item: T, idx: number) => {
                groupedList[groupedList.length - 1].push(item);

                const itemNumber: number = idx + 1;

                if (
                    itemNumber < list.length && // make sure separator is not added at the end
                    (itemNumber % (options.every || 0)) === 0
                ) {
                    groupedList.push([]);
                }

                return groupedList;
            }, [[]])
        };
    }

    return {
        groupLabels: Array.from(groupLabels),
        list
    };
};

export default groupList;
