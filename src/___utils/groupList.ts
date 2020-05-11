import getObjectDeepKeyValue from './getObjectDeepKeyValue';
import {isBoolean, isFunction, isNilOrEmpty, isNumber, isString} from './isType';
import reverseList from './reverseList';

export interface GroupOptionsInterface {
    by?: string | ((item: any, idx: number) => string | number) ;
    limit?: number;
    reversed?: boolean;
}

const defaultGroupOptions: GroupOptionsInterface = {
    by: '',
    limit: 0,
    reversed: false
};

interface GroupedItemsObjectInterface<T> {
    [s: string]: T[];
}

const handleGroupReverse = <T>(groupedLists: T[][], reverse = false) => {
    if (reverse && isBoolean(reverse)) {
        return groupedLists.map((group) => reverseList(group));
    }

    return groupedLists;
};

const groupList = <T>(list: T[], options: GroupOptionsInterface = defaultGroupOptions) => {
    let groupLabels: any[] = [];

    if (isNilOrEmpty(options)) {
        options = defaultGroupOptions;
    }

    const {by: groupBy, limit} = options;

    if (groupBy && (isFunction(groupBy) || isString(groupBy))) {
        const groupedList: GroupedItemsObjectInterface<T> = list
            .reduce((prevList: GroupedItemsObjectInterface<T>, item: T, idx: number) => {
                const groupLabel: any = isFunction(groupBy)
                    ? (groupBy as (item: any, idx: number) => string)(item, idx)
                    : getObjectDeepKeyValue(item, groupBy as string);

                if (!prevList[groupLabel]) {
                    prevList[groupLabel] = [];
                }

                if (!limit || (limit > 0 && prevList[groupLabel].length < limit)) {
                    prevList[groupLabel].push(item);
                }

                return prevList;
            }, {});

        // using Set here so the order is preserved and prevent duplicates
        groupLabels = Array.from(new Set(Object.keys(groupedList)));

        return {groupLabels, groupLists: handleGroupReverse(Object.values(groupedList), options.reversed)};
    } if (limit && isNumber(limit) && (limit > 0)) {
        let groupLabel = 1;
        const groupLists: GroupedItemsObjectInterface<T> = list
            .reduce((prevList: GroupedItemsObjectInterface<T>, item: T) => {
                if (!prevList[groupLabel]) {
                    prevList[groupLabel] = [];
                }

                prevList[groupLabel].push(item);

                if (prevList[groupLabel].length === limit) {
                    groupLabel += 1;
                }

                return prevList;
            }, {});

        groupLabels = Array.from(new Set(Object.keys(groupLists)));

        return {groupLabels, groupLists: handleGroupReverse(Object.values(groupLists), options.reversed)};
    }

    return {groupLabels, groupLists: handleGroupReverse([list], options.reversed)};
};

export default groupList;
