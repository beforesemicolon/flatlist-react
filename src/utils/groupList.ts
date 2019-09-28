import {isNumber, isObject, isFunction, isString} from './isType';
import getObjectDeepKeyValue from './getObjectDeepKeyValue';

export interface GroupOptionsInterface {
    by?: string | ((item: any, idx: number) => string) ;
    limit?: number;
}

const defaultGroupOptions: GroupOptionsInterface = {
    by: '',
    limit: 0
};

interface GroupedItemsObjectInterface<T> {
    [s: string]: T[];
}

const groupList = <T>(list: T[], options: GroupOptionsInterface = defaultGroupOptions) => {
    let groupLabels: string[] = [];

    if (!isObject(options) || Object.keys(options).length === 0) {
        options = defaultGroupOptions;
    }

    const {by: groupBy, limit} = options;

    if (groupBy && (isFunction(groupBy) || isString(groupBy))) {
        const groupedList: GroupedItemsObjectInterface<T> = list
            .reduce((prevList: GroupedItemsObjectInterface<T>, item: T, idx: number) => {
                const groupLabel = isFunction(groupBy) ?
                    (groupBy as (item: any, idx: number) => string)(item, idx) :
                    getObjectDeepKeyValue(groupBy as string, item);

                if (!prevList[groupLabel]) {
                    prevList[groupLabel] = [];
                }

                if (!limit || prevList[groupLabel].length < limit) {
                    prevList[groupLabel].push(item);
                }

                return prevList;
            }, {});

        // using Set here so the order is preserved and prevent duplicates
        groupLabels = Array.from(new Set(Object.keys(groupedList)));

        return {
            groupLabels,
            list: Object.values(groupedList)
        };
    } else if (limit && isNumber(limit) && (limit > 0)) {
        const groupOfList = list.reduce((groupedList: any[], item: T, idx: number) => {
            groupedList[groupedList.length - 1].push(item);

            const itemNumber: number = idx + 1;

            if (
                itemNumber < list.length && // make sure separator is not added at the end
                (itemNumber % (limit || 0)) === 0
            ) {
                groupedList.push([]);
            }

            return groupedList;
        }, [[]]);

        return {groupLabels, list: groupOfList};
    }

    return {
        groupLabels,
        list: [list]
    };
};

export default groupList;
