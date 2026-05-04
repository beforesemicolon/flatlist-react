import React, { createRef } from "react";
import DisplayHandler, {
  DisplayInterface,
} from "./___subComponents/DisplayHandler";
import InfiniteLoader, {
  InfiniteLoaderInterface,
} from "./___subComponents/InfiniteLoader";
import PlainList from "./___subComponents/PlainList";
import ScrollRenderer from "./___subComponents/ScrollRenderer";
import ScrollToTopButton from "./___subComponents/ScrollToTopButton";
import {
  handleRenderGroupFooter,
  handleRenderGroupHeader,
  handleRenderGroupSeparator,
  handleRenderItem,
  renderBlank,
} from "./___subComponents/uiFunctions";
import { isString } from "./___utils/isType";
import {
  defaultProps,
  FlatListProps,
  GroupInterface,
  ScrollToTopInterface,
} from "./flatListProps";
import { useList } from "./hooks/use-list";

function FlatList<ListItem>(props: FlatListProps<ListItem>) {
  const {
    renderWhenEmpty = null,
    wrapperHtmlTag,
    renderItem,
    renderOnScroll, // render/list related props
    group = {} as GroupInterface<ListItem>,
    groupSeparator, // group props
    renderGroupHeader,
    renderGroupFooter,
    renderTableHeader,
    renderTableFooter,
    display = {} as DisplayInterface,
    displayRow,
    rowGap,
    displayGrid,
    gridGap,
    minColumnWidth, // display props,
    displayTable,
    hasMoreItems,
    loadMoreItems,
    paginationLoadingIndicator,
    paginationLoadingIndicatorPosition,
    scrollToTop,
    scrollToTopButton = null,
    scrollToTopPadding,
    scrollToTopOffset,
    scrollToTopPosition,
    scrollingContainerId,
    inverted,
    pagination = {} as InfiniteLoaderInterface, // pagination props
    // eslint-disable-next-line @typescript-eslint/naming-convention
    // @ts-ignore
    __forwarededRef,
    ref,
    ...otherProps
  } = { ...defaultProps, ...props };
  const renderList = useList(props);

  const tagProps = Object.keys(otherProps)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((k: string) => (defaultProps as any)[k] === undefined)
    .reduce(
      (p, k: string) => ({
        ...p,
        [k]: (otherProps as Record<string, unknown>)[k],
      }),
      {},
    );

  const renderThisItem = handleRenderItem(
    renderItem,
    handleRenderGroupSeparator(group.separator || groupSeparator),
    handleRenderGroupHeader(
      group.renderHeader || renderGroupHeader || (props as any).groupHeader,
    ),
    handleRenderGroupFooter(
      group.renderFooter || renderGroupFooter || (props as any).groupFooter,
    ),
  );

  if (renderList.length === 0) {
    return renderBlank(renderWhenEmpty);
  }

  const content = (
    <>
      {inverted && (loadMoreItems || pagination.loadMore) && !renderOnScroll && (
        <InfiniteLoader
          itemsCount={renderList.length}
          hasMore={hasMoreItems || pagination.hasMore}
          loadMore={loadMoreItems || pagination.loadMore}
          loadingIndicator={
            paginationLoadingIndicator || pagination.loadingIndicator
          }
          scrollingContainerId={scrollingContainerId}
          inverted={inverted}
          loadingIndicatorPosition={
            paginationLoadingIndicatorPosition ||
            pagination.loadingIndicatorPosition
          }
        />
      )}
      {renderOnScroll && !(loadMoreItems || pagination.loadMore) ? (
        <ScrollRenderer
          list={renderList}
          renderItem={renderItem}
          groupSeparator={group.separator || groupSeparator}
        />
      ) : (
        renderList.map(renderThisItem)
      )}
      {(displayRow || displayGrid || display.grid || display.row) && (
        <DisplayHandler
          {...{
            display,
            displayRow,
            rowGap,
            displayGrid,
            gridGap,
            minColumnWidth,
          }}
        />
      )}
      {!inverted && (loadMoreItems || pagination.loadMore) && !renderOnScroll && (
        <InfiniteLoader
          itemsCount={renderList.length}
          hasMore={hasMoreItems || pagination.hasMore}
          loadMore={loadMoreItems || pagination.loadMore}
          loadingIndicator={
            paginationLoadingIndicator || pagination.loadingIndicator
          }
          scrollingContainerId={scrollingContainerId}
          inverted={inverted}
          loadingIndicatorPosition={
            paginationLoadingIndicatorPosition ||
            pagination.loadingIndicatorPosition
          }
        />
      )}
    </>
  );

  const showScrollToTopButton =
    scrollToTop === true ||
    (scrollToTop as ScrollToTopInterface).button ||
    scrollToTopButton;

  let Wrapper = "";

  if (
    (isString(wrapperHtmlTag) && wrapperHtmlTag) ||
    showScrollToTopButton ||
    displayTable ||
    display.table
  ) {
    Wrapper = wrapperHtmlTag || (displayTable || display.table ? "table" : "div");
  }

  const finalRef = ref || __forwarededRef;

  return (
    <>
      {Wrapper ? (
        // @ts-ignore
        <PlainList
          {...tagProps}
          list={renderList}
          renderItem={renderThisItem}
          ref={finalRef}
          wrapperHtmlTag={Wrapper}
          renderTableHeader={renderTableHeader}
          renderTableFooter={renderTableFooter}
        >
          {content}
        </PlainList>
      ) : (
        content
      )}
      {showScrollToTopButton && (
        <ScrollToTopButton
          button={
            scrollToTopButton ?? (scrollToTop as ScrollToTopInterface).button
          }
          padding={
            scrollToTopPadding ?? (scrollToTop as ScrollToTopInterface).padding
          }
          offset={
            scrollToTopOffset ?? (scrollToTop as ScrollToTopInterface).offset
          }
          position={
            scrollToTopPosition ??
            (scrollToTop as ScrollToTopInterface).position
          }
          scrollingContainer={finalRef as any}
        />
      )}
    </>
  );
}

FlatList.displayName = "FlatList";

export default FlatList;
