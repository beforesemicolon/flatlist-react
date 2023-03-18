import { ReactNode } from "react";
import {
  DisplayHandlerProps,
  DisplayInterface,
} from "./___subComponents/DisplayHandler";
import { InfiniteLoaderInterface } from "./___subComponents/InfiniteLoader";
import { renderFunc } from "./___subComponents/uiFunctions";
import { GroupOptionsInterface } from "./___utils/groupList";
import { SearchOptionsInterface } from "./___utils/searchList";
import { SortOptionsInterface } from "./___utils/sortList";

export type List<T> = Array<T> | Set<T> | Map<any, T> | { [key: string]: T };

export interface GroupInterface<ListItem>
  extends GroupOptionsInterface<ListItem> {
  limit?: number;
  of?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  separator?:
    | ReactNode
    | ((g: ListItem[], idx: number, label: string) => ReactNode | null)
    | null;
  separatorAtTheBottom?: boolean;
  sortBy?: SortOptionsInterface["by"];
  sortedBy?: SortOptionsInterface["by"];
  sortDescending?: boolean;
  sortedDescending?: boolean;
  sortCaseInsensitive?: boolean;
  sortedCaseInsensitive?: boolean;
}

export interface ScrollToTopInterface {
  button?: ReactNode | (() => JSX.Element);
  offset?: number;
  padding?: number;
  position?:
    | "top"
    | "bottom"
    | "top right"
    | "top left"
    | "bottom left"
    | "bottom right";
}

export interface SortInterface<ListItem> extends SortOptionsInterface {
  groupBy?: GroupInterface<ListItem>["sortBy"];
  groupDescending?: GroupInterface<ListItem>["sortDescending"];
  groupCaseInsensitive?: GroupInterface<ListItem>["sortCaseInsensitive"];
}

export interface FlatListProps<ListItem> {
  // RENDER
  list: List<ListItem>;
  renderItem: renderFunc<ListItem>;
  renderWhenEmpty?: ReactNode | (() => JSX.Element);
  renderOnScroll?: boolean;
  limit?: number | string;
  reversed?: boolean;
  wrapperHtmlTag?: string;
  // sorting
  sort?: boolean | SortInterface<ListItem>;
  sortBy?: SortInterface<ListItem>["by"];
  sortCaseInsensitive?: SortInterface<ListItem>["caseInsensitive"];
  sortDesc?: SortInterface<ListItem>["descending"];
  sortDescending?: SortInterface<ListItem>["descending"];
  sortGroupBy?: GroupInterface<ListItem>["sortBy"]; // deprecated
  sortGroupDesc?: GroupInterface<ListItem>["sortDescending"]; // deprecated
  sortGroupDescending?: GroupInterface<ListItem>["sortDescending"];
  sortGroupCaseInsensitive?: GroupInterface<ListItem>["sortCaseInsensitive"]; // deprecated
  // grouping
  group?: GroupInterface<ListItem>;
  showGroupSeparatorAtTheBottom?: GroupInterface<ListItem>["separatorAtTheBottom"]; // deprecated
  groupSeparatorAtTheBottom?: GroupInterface<ListItem>["separatorAtTheBottom"];
  groupReversed?: GroupInterface<ListItem>["reversed"];
  groupSeparator?: GroupInterface<ListItem>["separator"];
  groupBy?: GroupInterface<ListItem>["by"];
  groupOf?: GroupInterface<ListItem>["limit"];
  groupSorted?: boolean;
  groupSortedDescending?: GroupInterface<ListItem>["sortDescending"];
  groupSortedCaseInsensitive?: GroupInterface<ListItem>["sortCaseInsensitive"];
  // display
  display?: DisplayInterface;
  displayRow?: DisplayHandlerProps["displayRow"];
  rowGap?: DisplayHandlerProps["rowGap"];
  displayGrid?: DisplayHandlerProps["displayGrid"];
  gridGap?: DisplayHandlerProps["gridGap"];
  minColumnWidth?: DisplayHandlerProps["minColumnWidth"];
  // filtering
  filterBy?: string | ((item: ListItem, idx: number) => boolean);
  // searching
  search?: SearchOptionsInterface<ListItem>;
  searchTerm?: SearchOptionsInterface<ListItem>["term"];
  searchBy?: SearchOptionsInterface<ListItem>["by"];
  searchOnEveryWord?: SearchOptionsInterface<ListItem>["everyWord"];
  searchCaseInsensitive?: SearchOptionsInterface<ListItem>["caseInsensitive"];
  searchableMinCharactersCount?: SearchOptionsInterface<ListItem>["minCharactersCount"]; // deprecated
  // pagination
  pagination?: InfiniteLoaderInterface;
  hasMoreItems?: InfiniteLoaderInterface["hasMore"];
  loadMoreItems?: null | InfiniteLoaderInterface["loadMore"];
  paginationLoadingIndicator?: InfiniteLoaderInterface["loadingIndicator"];
  paginationLoadingIndicatorPosition?: InfiniteLoaderInterface["loadingIndicatorPosition"];
  // scrollToTop
  scrollToTop?: boolean | ScrollToTopInterface;
  scrollToTopButton?: ReactNode | (() => ReactNode);
  scrollToTopOffset?: number;
  scrollToTopPadding?: number;
  scrollToTopPosition?: string;
  // others
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const defaultProps: FlatListProps<any> = {
  __forwarededRef: { current: null },
  // RENDER
  list: [],
  renderItem: () => null,
  limit: 0,
  renderWhenEmpty: null,
  reversed: false,
  renderOnScroll: false,
  wrapperHtmlTag: "",
  // DISPLAY
  display: {
    grid: false,
    gridGap: "",
    gridMinColumnWidth: "",
    row: false,
    rowGap: "",
  },
  displayGrid: false,
  displayRow: false,
  gridGap: "",
  rowGap: "",
  minColumnWidth: "",
  // FILTER
  filterBy: "",
  // GROUPS
  group: {
    by: "",
    limit: 0, // deprecated
    of: 0,
    reversed: false,
    separator: null,
    separatorAtTheBottom: false,
    sortedBy: "",
    sortBy: "", // deprecated
    sortedCaseInsensitive: false,
    sortCaseInsensitive: false, // deprecated
    sortedDescending: false,
    sortDescending: false, // deprecated
  },
  groupBy: "",
  groupOf: 0,
  groupReversed: false,
  groupSeparator: null,
  groupSeparatorAtTheBottom: false,
  groupSorted: false,
  groupSortedBy: "",
  groupSortedDescending: false,
  groupSortedCaseInsensitive: false,
  showGroupSeparatorAtTheBottom: false, // deprecated
  // PAGINATION
  pagination: {
    hasMore: false,
    loadMore: null,
    loadingIndicator: null,
    loadingIndicatorPosition: "",
  },
  hasMoreItems: false,
  loadMoreItems: null,
  paginationLoadingIndicator: null,
  paginationLoadingIndicatorPosition: "",
  // SCROLL TO TOP
  scrollToTop: {
    button: null,
    offset: undefined,
    padding: undefined,
    position: undefined,
  },
  scrollToTopButton: null,
  scrollToTopOffset: undefined,
  scrollToTopPadding: undefined,
  scrollToTopPosition: undefined,
  // SEARCH
  search: {
    by: "",
    caseInsensitive: false,
    everyWord: false, // deprecated
    onEveryWord: false,
    minCharactersCount: 0,
    term: "",
  },
  searchBy: "",
  searchCaseInsensitive: false,
  searchOnEveryWord: false,
  searchTerm: "",
  searchMinCharactersCount: 0,
  searchableMinCharactersCount: 0, // deprecated
  // SORT
  sort: {
    by: "",
    caseInsensitive: false,
    descending: false,
    groupBy: "", // deprecated
    groupCaseInsensitive: false, // deprecated
    groupDescending: false, // deprecated
  },
  sortBy: "",
  sortCaseInsensitive: false,
  sortDesc: false, // deprecated
  sortDescending: false,
  sortGroupBy: "", // deprecated
  sortGroupDesc: false, // deprecated
  sortGroupCaseInsensitive: false, // deprecated
};
