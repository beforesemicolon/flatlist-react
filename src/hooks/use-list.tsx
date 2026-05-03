import { useMemo } from "react";
import convertListToArray from "../___utils/convertListToArray";
import filterList from "../___utils/filterList";
import groupList from "../___utils/groupList";
import { isBoolean, isNil } from "../___utils/isType";
import limitList from "../___utils/limitList";
import reverseList from "../___utils/reverseList";
import searchList from "../___utils/searchList";
import sortList from "../___utils/sortList";
import { defaultProps, FlatListProps, SortInterface } from "../flatListProps";

export const useList = <ListItem,>({
  list,
  limit,
  reversed,
  filterBy,
  group,
  groupBy,
  groupOf,
  showGroupSeparatorAtTheBottom,
  groupReversed,
  groupSeparatorAtTheBottom,
  groupSortedCaseInsensitive,
  groupSortedDescending,
  groupSorted,
  groupSortedBy,
  sortBy,
  sortDesc,
  sort,
  sortCaseInsensitive,
  sortGroupBy,
  sortGroupDesc,
  sortGroupCaseInsensitive,
  sortDescending,
  search,
  searchBy,
  searchOnEveryWord,
  searchTerm,
  searchCaseInsensitive,
  searchableMinCharactersCount,
  searchMinCharactersCount,
}: FlatListProps<ListItem>): ListItem[] => {
  // convert list to array
  const arrayList = useMemo(() => convertListToArray(list), [list]);

  // reverse list
  const reversedList = useMemo(
    () =>
      typeof reversed === "boolean" && reversed
        ? reverseList(arrayList)
        : arrayList,
    [arrayList, reversed],
  );

  // limit list
  const limitedList = useMemo(() => {
    if (!isNil(limit)) {
      const [from, to] = `${limit}`.split(",");
      return limitList(reversedList, from, to);
    }

    return reversedList;
  }, [reversedList, limit]);

  // filter list
  const filteredList = useMemo(
    () => (filterBy ? filterList(limitedList, filterBy) : limitedList),
    [limitedList, filterBy],
  );

  // search list
  const searchedList = useMemo(() => {
    if (searchTerm || (search && search.term)) {
      const searchOptions = {
        ...defaultProps.search,
        ...search,
      };

      return searchList(filteredList, {
        by: searchOptions.by || searchBy || "0",
        caseInsensitive: searchOptions.caseInsensitive || searchCaseInsensitive,
        everyWord:
          searchOptions.onEveryWord ||
          searchOptions.everyWord || // deprecated
          searchOnEveryWord,
        term: searchOptions.term || searchTerm,
        minCharactersCount:
          (searchOptions as any).searchableMinCharactersCount || // deprecated
          searchOptions.minCharactersCount ||
          searchMinCharactersCount ||
          searchableMinCharactersCount || // deprecated
          3,
      });
    }

    return filteredList;
  }, [
    filteredList,
    search,
    searchBy,
    searchOnEveryWord,
    searchTerm,
    searchCaseInsensitive,
    searchableMinCharactersCount,
    searchMinCharactersCount,
  ]);

  const sortOptions = useMemo(
    () => ({
      ...(defaultProps.sort as SortInterface<ListItem>),
      ...(sort as SortInterface<ListItem>),
    }),
    [sort],
  );

  // sort list
  const sortedList = useMemo(() => {
    if (sortOptions.by || sortBy || (isBoolean(sort) && sort)) {
      return sortList(searchedList, {
        caseInsensitive:
          sortOptions.caseInsensitive || sortCaseInsensitive || false,
        descending:
          sortOptions.descending || sortDescending || sortDesc || false, // deprecated
        by: sortOptions.by || sortBy,
      });
    }

    return searchedList;
  }, [
    searchedList,
    sortOptions,
    sortBy,
    sortDesc,
    sort,
    sortCaseInsensitive,
    sortDescending,
  ]);

  // group list
  const groupedList = useMemo(() => {
    const groupOptions = {
      ...defaultProps.group,
      ...group,
    };

    if (
      groupOptions.by ||
      groupBy ||
      groupOf ||
      groupOptions.of ||
      groupOptions.limit
    ) {
      const groupingOptions = {
        by: groupOptions.by || groupBy,
        limit: groupOptions.of || groupOf || groupOptions.limit, // deprecated
        reversed: groupOptions.reversed || groupReversed,
      };

      const gList = groupList(sortedList, groupingOptions);

      return gList.groupLists.reduce((newGList: any, aGroup, idx: number) => {
        let currentGroup = aGroup;
        if (
          groupSorted ||
          (groupOptions as any).sorted ||
          groupSortedBy ||
          (groupOptions as any).sortedBy ||
          groupOptions.sortBy ||
          sortGroupBy ||
          sortOptions.groupBy // deprecated
        ) {
          currentGroup = sortList(aGroup, {
            caseInsensitive:
              groupSortedCaseInsensitive ||
              (groupOptions as any).sortedCaseInsensitive ||
              groupOptions.sortCaseInsensitive || // deprecated
              sortGroupCaseInsensitive || // deprecated
              sortOptions.groupCaseInsensitive, // deprecated
            descending:
              groupSortedDescending ||
              (groupOptions as any).sortedDescending ||
              groupOptions.sortDescending || // deprecated
              sortGroupDesc, // deprecated
            by:
              groupSortedBy ||
              (groupOptions as any).sortedBy ||
              groupOptions.sortBy || // deprecated
              sortGroupBy, // deprecated
          });
        }

        const separator = [
          "___list-separator",
          gList.groupLabels[idx],
          currentGroup,
        ];

        if (
          groupOptions.separatorAtTheBottom ||
          groupSeparatorAtTheBottom ||
          showGroupSeparatorAtTheBottom
        ) {
          return [...newGList, ...currentGroup, separator];
        }

        return [...newGList, separator, ...currentGroup];
      }, []);
    }

    return sortedList;
  }, [
    sortedList,
    group,
    groupReversed,
    groupSeparatorAtTheBottom,
    groupSortedCaseInsensitive,
    groupSortedDescending,
    groupSorted,
    groupSortedBy,
    sortGroupBy,
    sortGroupDesc,
    sortGroupCaseInsensitive,
  ]);

  return groupedList;
};
