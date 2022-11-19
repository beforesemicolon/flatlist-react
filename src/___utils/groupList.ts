import getObjectDeepKeyValue from "./getObjectDeepKeyValue";
import {
  isBoolean,
  isFunction,
  isNilOrEmpty,
  isNumber,
  isString,
} from "./isType";
import reverseList from "./reverseList";

export interface GroupOptionsInterface<ListItem> {
  by?: string | ((item: ListItem, idx: number) => string | number);
  limit?: number;
  reversed?: boolean;
}

const defaultGroupOptions: GroupOptionsInterface<any> = {
  by: "",
  limit: 0,
  reversed: false,
};

interface GroupedItemsObjectInterface<T> {
  [s: string]: T[];
}

const handleGroupReverse = <ListItem>(
  groupedLists: ListItem[][],
  reverse = false
) => {
  if (reverse && isBoolean(reverse)) {
    return groupedLists.map((group) => reverseList(group));
  }

  return groupedLists;
};

const groupList = <ListItem>(
  list: ListItem[],
  options: GroupOptionsInterface<ListItem> = defaultGroupOptions
) => {
  let groupLabels: any[] = [];

  if (isNilOrEmpty(options)) {
    options = defaultGroupOptions;
  }

  const { by: groupBy, limit } = options;

  if (groupBy && (isFunction(groupBy) || isString(groupBy))) {
    const groupedList: GroupedItemsObjectInterface<ListItem> = list.reduce(
      (
        prevList: GroupedItemsObjectInterface<ListItem>,
        item: ListItem,
        idx: number
      ) => {
        const groupLabel: any = isFunction(groupBy)
          ? (groupBy as (item: ListItem, idx: number) => string)(item, idx)
          : getObjectDeepKeyValue(item, groupBy as string);

        if (!prevList[groupLabel]) {
          prevList[groupLabel] = [];
        }

        if (!limit || (limit > 0 && prevList[groupLabel].length < limit)) {
          prevList[groupLabel].push(item);
        }

        return prevList;
      },
      {}
    );

    // using Set here so the order is preserved and prevent duplicates
    groupLabels = Array.from(new Set(Object.keys(groupedList)));

    return {
      groupLabels,
      groupLists: handleGroupReverse(
        Object.values(groupedList),
        options.reversed
      ),
    };
  }
  if (limit && isNumber(limit) && limit > 0) {
    let groupLabel = 1;
    const groupLists: GroupedItemsObjectInterface<ListItem> = list.reduce(
      (prevList: GroupedItemsObjectInterface<ListItem>, item: ListItem) => {
        if (!prevList[groupLabel]) {
          prevList[groupLabel] = [];
        }

        prevList[groupLabel].push(item);

        if (prevList[groupLabel].length === limit) {
          groupLabel += 1;
        }

        return prevList;
      },
      {}
    );

    groupLabels = Array.from(new Set(Object.keys(groupLists)));

    return {
      groupLabels,
      groupLists: handleGroupReverse(
        Object.values(groupLists),
        options.reversed
      ),
    };
  }

  return {
    groupLabels,
    groupLists: handleGroupReverse([list], options.reversed),
  };
};

export default groupList;
