import { array, bool, func, node, object, oneOfType, string } from "prop-types";
import React, { forwardRef, ReactNode, Ref, useMemo } from "react";
import convertListToArray from "../___utils/convertListToArray";
import { isString } from "../___utils/isType";
import DefaultBlank from "./DefaultBlank";
import ScrollRenderer from "./ScrollRenderer";
import { handleRenderItem, renderBlank, renderFunc } from "./uiFunctions";
import { List } from "../flatListProps";

export interface PlainListProps<ListItem> {
  list: List<ListItem>;
  renderItem: renderFunc<ListItem>;
  renderWhenEmpty?: ReactNode | (() => JSX.Element);
  wrapperHtmlTag?: string;
  renderOnScroll?: boolean;
  [key: string]: any;
}

function PlainList<ListItem>(props: PlainListProps<ListItem>) {
  const {
    list,
    renderItem,
    renderWhenEmpty,
    renderOnScroll,
    wrapperHtmlTag,
    __forwarededRef,
    ...tagProps
  } = props;
  const dataList = convertListToArray(list);

  const renderThisItem = useMemo(
    () => handleRenderItem(renderItem, null),
    [renderItem]
  );

  if (dataList.length === 0) {
    return renderBlank(renderWhenEmpty);
  }

  const WrapperElement = `${
    isString(wrapperHtmlTag) && wrapperHtmlTag ? wrapperHtmlTag : ""
  }`;
  const content = (
    <>
      {renderOnScroll ? (
        <ScrollRenderer list={dataList} renderItem={renderItem} />
      ) : (
        dataList.map(renderThisItem)
      )}
    </>
  );

  return (
    <>
      {WrapperElement ? (
        // @ts-ignore
        <WrapperElement {...tagProps} ref={__forwarededRef}>
          {content}
        </WrapperElement>
      ) : (
        content
      )}
    </>
  );
}

PlainList.propTypes = {
  /**
   * a list of anything to be displayed
   */
  list: oneOfType([array, object]).isRequired,
  /**
   * a jsx element or a function that it is called for every item on the list and returns a jsx element
   */
  renderItem: oneOfType([func, node]).isRequired,
  /**
   * the function that gets called when the list is empty or was filtered to the point it became empty
   */
  renderWhenEmpty: func,
  /**
   * an optional html tag to use to wrap the list items
   */
  wrapperHtmlTag: string,
  forwardRef: object,
  renderOnScroll: bool,
};

PlainList.defaultProps = {
  wrapperHtmlTag: "",
  renderWhenEmpty: DefaultBlank,
  renderOnScroll: false,
};

export default forwardRef(
  <ListItem,>(props: PlainListProps<ListItem>, ref: Ref<HTMLElement>) => (
    <PlainList __forwarededRef={ref} {...props} />
  )
) as <ListItem>(props: PlainListProps<ListItem>) => JSX.Element;
