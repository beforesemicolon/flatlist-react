import { array, bool, func, node, object, oneOfType, string } from "prop-types";
import React, { forwardRef, Ref } from "react";
import convertListToArray from "../___utils/convertListToArray";
import { isString } from "../___utils/isType";
import { listItem } from "../props";
import DefaultBlank from "./DefaultBlank";
import ScrollRenderer from "./ScrollRenderer";
import { handleRenderItem, renderBlank, renderFunc } from "./uiFunctions";

interface Props {
  list: listItem[];
  renderItem: JSX.Element | renderFunc;
  renderWhenEmpty?: null | (() => JSX.Element);
  wrapperHtmlTag?: string;
  renderOnScroll?: boolean;
  forwardRef?: Ref<HTMLElement>;
  [key: string]: any;
}

function PlainList(props: Props) {
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
        dataList.map(handleRenderItem(renderItem))
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

export default forwardRef((props: Props, ref: Ref<HTMLElement>) => (
  <PlainList forwardRef={ref} {...props} />
));
