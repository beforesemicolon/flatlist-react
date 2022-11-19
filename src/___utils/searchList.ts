import filterList from "./filterList";
import getObjectDeepKeyValue from "./getObjectDeepKeyValue";
import { isArray, isFunction, isObject, isNilOrEmpty } from "./isType";

type cb<ListItem> = (item: ListItem, idx: number) => boolean;
type termCb<ListItem> = (item: ListItem, term: string, idx: number) => boolean;

export interface SearchOptionsInterface<ListItem> {
  term?: string;
  everyWord?: boolean;
  onEveryWord?: boolean;
  caseInsensitive?: boolean;
  minCharactersCount?: number;
  by?:
    | string
    | Array<string | { key: string; caseInsensitive?: boolean }>
    | termCb<ListItem>;
}

const defaultSearchOptions = {
  by: "0",
  caseInsensitive: false,
  everyWord: false,
  minCharactersCount: 3,
  term: "",
};

const defaultFilterByFn = (
  item: any,
  term: string | string[],
  caseInsensitive = false,
  by = "0"
) => {
  const keyValue =
    isObject(item) || isArray(item)
      ? getObjectDeepKeyValue(item, by as string)
      : item;

  const value = caseInsensitive ? `${keyValue}`.toLowerCase() : `${keyValue}`;

  if (isArray(term)) {
    return (term as []).some((t: string) => {
      t = caseInsensitive ? t.toLowerCase() : t.trim();

      return value.search(t.trim()) >= 0;
    });
  }

  term = caseInsensitive ? (term as string).toLowerCase() : (term as string);

  return value.search(term.trim() as string) >= 0;
};

const getFilterByFn = <ListItem>(
  term: string | string[],
  by: SearchOptionsInterface<ListItem>["by"],
  caseInsensitive = false
): cb<ListItem> => {
  if (isFunction(by)) {
    if (isArray(term)) {
      return (item: ListItem, idx: number) =>
        (term as string[]).some((t: string) => {
          t = caseInsensitive ? (t as string).toLowerCase() : t;
          return (by as termCb<ListItem>)(item, t.trim(), idx);
        });
    }

    term = caseInsensitive ? (term as string).toLowerCase() : term;
    return (item: ListItem, idx: number) =>
      (by as termCb<ListItem>)(item, (term as string).trim(), idx);
  }

  if (isArray(by)) {
    return (item: ListItem) =>
      (by as []).some((key: any) => {
        const keyCaseInsensitive =
          isObject(key) && key.caseInsensitive !== undefined
            ? key.caseInsensitive
            : caseInsensitive;
        const keyBy = (isObject(key) ? key.key : key) || "0";
        return defaultFilterByFn(item, term, keyCaseInsensitive, keyBy);
      });
  }

  return (item: ListItem) =>
    defaultFilterByFn(item, term, caseInsensitive, (by as string) || "0");
};

const searchList = <ListItem>(
  list: ListItem[],
  options: SearchOptionsInterface<ListItem>
): ListItem[] => {
  if (isNilOrEmpty(options)) {
    options = defaultSearchOptions as SearchOptionsInterface<ListItem>;
  }

  if (list.length > 0) {
    const { term, by = "0", minCharactersCount = 0 } = options;

    if (term && by && term.length >= minCharactersCount) {
      const { everyWord, caseInsensitive } = options;

      if (everyWord) {
        const termWords = term
          .trim()
          .split(/\s+/)
          .filter((word: string) => word.length >= minCharactersCount);

        if (termWords.length > 0) {
          const filterByFn = getFilterByFn(
            Array.from(new Set(termWords)),
            by,
            caseInsensitive
          );

          return filterList(list, filterByFn);
        }
      } else {
        const filterByFn = getFilterByFn(term, by, caseInsensitive);

        return filterList(list, filterByFn);
      }
    }
  }

  return list;
};

export default searchList;
