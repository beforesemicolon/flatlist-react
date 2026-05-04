import React from "react";
import convertListToArray from "../___utils/convertListToArray";
import { isString } from "../___utils/isType";
import ScrollRenderer from "./ScrollRenderer";
import { handleRenderItem, renderBlank, renderFunc } from "./uiFunctions";
import { List } from "../flatListProps";

export interface PlainListProps<ListItem> {
  list: List<ListItem>;
  renderItem: renderFunc<ListItem>;
  renderWhenEmpty?: React.ReactNode | (() => React.JSX.Element);
  wrapperHtmlTag?: string;
  renderOnScroll?: boolean;
  renderTableHeader?: () => React.ReactNode;
  renderTableFooter?: () => React.ReactNode;
  ref?: React.Ref<HTMLElement>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __forwarededRef?: React.Ref<HTMLElement>;
  [key: string]: any;
}

function PlainList<ListItem>(props: PlainListProps<ListItem>) {
  const {
    list,
    renderItem,
    renderWhenEmpty,
    renderOnScroll,
    renderTableHeader,
    renderTableFooter,
    wrapperHtmlTag,
    __forwarededRef,
    ref,
    ...tagProps
  } = props;
  const dataList = convertListToArray(list);

  const renderThisItem = handleRenderItem(renderItem, null);

  if (dataList.length === 0) {
    return renderBlank(renderWhenEmpty);
  }

  const isTable = wrapperHtmlTag === "table";
  const Wrapper = `${
    isString(wrapperHtmlTag) && wrapperHtmlTag ? wrapperHtmlTag : ""
  }`;
  const content = (
    <>
      {renderOnScroll ? (
        <ScrollRenderer list={dataList} renderItem={renderItem} />
      ) : (
        dataList.map((item, idx) => renderThisItem(item, `${idx}`))
      )}
    </>
  );

  const finalRef = ref || __forwarededRef;

  return (
    <>
      {Wrapper ? (
        // @ts-ignore
        <Wrapper {...tagProps} ref={finalRef}>
          {isTable ? (
            <>
              {renderTableHeader && <thead>{renderTableHeader()}</thead>}
              <tbody>{content}</tbody>
              {renderTableFooter && <tfoot>{renderTableFooter()}</tfoot>}
            </>
          ) : (
            content
          )}
        </Wrapper>
      ) : (
        content
      )}
    </>
  );
}

PlainList.displayName = "PlainList";

export default PlainList;
