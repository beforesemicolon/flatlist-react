import { array, bool, func, node, object, oneOfType, string } from "prop-types";
import React, { forwardRef, ReactNode, Ref } from "react";
import convertListToArray from "../___utils/convertListToArray";
import { isString } from "../___utils/isType";
import { listItem } from "../flatListProps";
import DefaultBlank from "./DefaultBlank";
import ScrollRenderer from "./ScrollRenderer";
import { handleRenderItem, renderBlank, renderFunc } from "./uiFunctions";

export interface PlainListProps {
  list: listItem[];
  renderItem: ReactNode | renderFunc;
  renderWhenEmpty?: ReactNode | (() => JSX.Element);
  wrapperHtmlTag?: string;
  renderOnScroll?: boolean;
  forwardRef?: Ref<HTMLElement>;
  [key: string]: any;
}

function PlainList(props: PlainListProps) {
  const {
    list,
    renderItem,
    renderWhenEmpty,
    renderOnScroll,
    wrapperHtmlTag,
    forwardRef,
    ...tagProps
  } = props;
  const dataList = convertListToArray(list);

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
        dataList.map(handleRenderItem(renderItem) as renderFunc)
      )}
    </>
  );

  return (
    <>
      {WrapperElement ? (
        // @ts-ignore
        <WrapperElement {...tagProps} ref={forwardRef}>
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
  forwardRef: { current: null },
};

export default forwardRef((props: PlainListProps, ref: Ref<HTMLElement>) => (
  <PlainList forwardRef={ref} {...props} />
));
