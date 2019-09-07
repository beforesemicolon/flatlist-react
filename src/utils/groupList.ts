import {isNumber, isObject, isFunction, isString} from './isType';
import getObjectDeepKeyValue from './getObjectDeepKeyValue';

export interface GroupOptionsInterface {
    by?: string;
    on?: ((item: any, idx: number) => string) | undefined;
    every?: number;
}

const defaultGroupOptions: GroupOptionsInterface = {
    by: '',
    every: 0,
    on: undefined
};

const groupList = <T>(list: T[], options: GroupOptionsInterface = defaultGroupOptions) => {

    if (!isObject(options) || Object.keys(options).length === 0) {
        options = defaultGroupOptions;
    }

    options = {...defaultGroupOptions, ...options};

    interface GroupedItemsObjectInterface {
        [s: string]: T[];
    }

    if (options.by && isString(options.by)) {
        const groupedList: GroupedItemsObjectInterface = list
            .reduce((prevList: GroupedItemsObjectInterface, item: T): GroupedItemsObjectInterface => {
                const groupLabel = getObjectDeepKeyValue(options.by, item);

                if (!prevList[groupLabel]) {
                    prevList[groupLabel] = [];
                }

                prevList[groupLabel].push(item);

                return prevList;
            }, {});

        return Object.values(groupedList);
    }

    if (options.on as (item: any, idx: number) => string && isFunction(options.on)) {
        const groupedList: GroupedItemsObjectInterface = list
            .reduce((prevList: GroupedItemsObjectInterface, item: T, idx: number): GroupedItemsObjectInterface => {
                const on: GroupOptionsInterface['on'] = options.on as (item: any, idx: number) => string;
                const groupLabel: string = on(item, idx);

                if (!prevList[groupLabel]) {
                    prevList[groupLabel] = [];
                }

                prevList[groupLabel].push(item);

                return prevList;
            }, {});

        return Object.values(groupedList);
    }

    if (options.every && isNumber(options.every) && (options.every > 0)) {
        return list.reduce((groupedList: any[], item: T, idx: number) => {
            groupedList[groupedList.length - 1].push(item);

            const itemNumber: number = idx + 1;

            if (
                itemNumber < list.length && // make sure separator is not added at the end
                (itemNumber % (options.every || 0)) === 0
            ) {
                groupedList.push([]);
            }

            return groupedList;
        }, [[]]);
    }

    return list;
};

export default groupList;
