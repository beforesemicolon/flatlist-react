import React, { createRef, forwardRef, ReactNode, Ref, useMemo } from "react";
import convertListToArray from "../___utils/convertListToArray";
import { isString } from "../___utils/isType";
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

export default forwardRef(
  <ListItem,>(props: PlainListProps<ListItem>, ref: Ref<HTMLElement>) => {
    ref = ref || createRef();
    return <PlainList __forwarededRef={ref} {...props} />;
  }
) as <ListItem>(props: PlainListProps<ListItem>) => JSX.Element;
