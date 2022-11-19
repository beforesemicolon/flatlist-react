import React, { useMemo } from "react";
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
  let renderList = useMemo(() => convertListToArray(list), [list]);

  // reverse list
  renderList = useMemo(
    () =>
      typeof reversed === "boolean" && reversed
        ? reverseList(renderList)
        : renderList,
    [renderList, reversed]
  );

  // limit list
  renderList = useMemo(() => {
    if (!isNil(limit)) {
      const [from, to] = `${limit}`.split(",");
      return limitList(renderList, from, to);
    }

    return renderList;
  }, [renderList, limit]);

  // filter list
  renderList = useMemo(
    () => (filterBy ? filterList(renderList, filterBy) : renderList),
    [renderList, filterBy]
  );

  // search list
  renderList = useMemo(() => {
    if (searchTerm || (search && search.term)) {
      const searchOptions = {
        ...defaultProps.search,
        ...search,
      };

      return searchList(renderList, {
        by: searchOptions.by || searchBy || "0",
        caseInsensitive: searchOptions.caseInsensitive || searchCaseInsensitive,
        everyWord:
          searchOptions.onEveryWord ||
          searchOptions.everyWord || // deprecated
          searchOnEveryWord,
        term: searchOptions.term || searchTerm,
        minCharactersCount:
          // @ts-ignore
          searchOptions.searchableMinCharactersCount || // deprecated
          searchOptions.minCharactersCount ||
          searchMinCharactersCount ||
          searchableMinCharactersCount || // deprecated
          3,
      });
    }

    return renderList;
  }, [
    renderList,
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
    [renderList, sort]
  );

  // sort list
  renderList = useMemo(() => {
    if (sortOptions.by || sortBy || (isBoolean(sort) && sort)) {
      return sortList(renderList, {
        caseInsensitive:
          sortOptions.caseInsensitive || sortCaseInsensitive || false,
        descending:
          sortOptions.descending || sortDescending || sortDesc || false, // deprecated
        by: sortOptions.by || sortBy,
      });
    }

    return renderList;
  }, [
    renderList,
    sortOptions,
    sortBy,
    sortDesc,
    sort,
    sortCaseInsensitive,
    sortDescending,
  ]);

  // group list
  renderList = useMemo(() => {
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

      const gList = groupList(renderList, groupingOptions);

      return gList.groupLists.reduce((newGList: any, aGroup, idx: number) => {
        if (
          groupSorted ||
          // @ts-ignore
          groupOptions.sorted ||
          groupSortedBy ||
          // @ts-ignore
          groupOptions.sortedBy ||
          groupOptions.sortBy ||
          sortGroupBy ||
          sortOptions.groupBy // deprecated
        ) {
          aGroup = sortList(aGroup, {
            caseInsensitive:
              groupSortedCaseInsensitive ||
              // @ts-ignore
              groupOptions.sortedCaseInsensitive ||
              groupOptions.sortCaseInsensitive || // deprecated
              sortGroupCaseInsensitive || // deprecated
              sortOptions.groupCaseInsensitive, // deprecated
            descending:
              groupSortedDescending ||
              // @ts-ignore
              groupOptions.sortedDescending ||
              groupOptions.sortDescending || // deprecated
              sortGroupDesc, // deprecated
            by:
              groupSortedBy ||
              // @ts-ignore
              groupOptions.sortedBy ||
              groupOptions.sortBy || // deprecated
              sortGroupBy, // deprecated
          });
        }

        const separator = ["___list-separator", gList.groupLabels[idx], aGroup];

        if (
          groupOptions.separatorAtTheBottom ||
          groupSeparatorAtTheBottom ||
          showGroupSeparatorAtTheBottom
        ) {
          return [...newGList, ...aGroup, separator];
        }

        return [...newGList, separator, ...aGroup];
      }, []);
    }

    return renderList;
  }, [
    renderList,
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

  return renderList;
};
