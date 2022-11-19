import React, {forwardRef, Ref, useMemo} from 'react';
import DisplayHandler, {DisplayInterface} from './___subComponents/DisplayHandler';
import InfiniteLoader, {InfiniteLoaderInterface} from './___subComponents/InfiniteLoader';
import ScrollRenderer from './___subComponents/ScrollRenderer';
import ScrollToTopButton from './___subComponents/ScrollToTopButton';
import {handleRenderGroupSeparator, handleRenderItem, renderBlank} from './___subComponents/uiFunctions';
import {isString} from './___utils/isType';
import {defaultProps, FlatListProps, GroupInterface, propTypes, ScrollToTopInterface} from './flatListProps';
import {useList} from './hooks/use-list';
import {PlainListProps} from './___subComponents/PlainList';

function FlatList<ListItem>(props: FlatListProps<ListItem>) {
    const {
        list, renderWhenEmpty = null, wrapperHtmlTag, renderItem, renderOnScroll, // render/list related props
        group = {} as GroupInterface, groupSeparator, // group props
        display = {} as DisplayInterface, displayRow, rowGap, displayGrid, gridGap, minColumnWidth, // display props,
        hasMoreItems, loadMoreItems, paginationLoadingIndicator, paginationLoadingIndicatorPosition,
        scrollToTop, scrollToTopButton = null, scrollToTopPadding, scrollToTopOffset, scrollToTopPosition,
        pagination = {} as InfiniteLoaderInterface, // pagination props
        __forwarededRef,
        ...otherProps
    } = props;
    const renderList = useList(props);

    const tagProps = useMemo(() => Object.keys(otherProps)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((k: string) => ((defaultProps as any)[k] === undefined))
        .reduce((p, k: string) => ({...p, [k]: otherProps[k]}), {}), [otherProps]);

    const renderThisItem = useMemo(() => handleRenderItem(
        renderItem,
        handleRenderGroupSeparator(group.separator || groupSeparator)
    ), [renderItem, group.separator, groupSeparator]);

    if (renderList.length === 0) {
        return renderBlank(renderWhenEmpty);
    }

    const content = (
        <>
            {
                (renderOnScroll && !(loadMoreItems || pagination.loadMore))
                    ? (
                        <ScrollRenderer
                            list={renderList}
                            renderItem={renderItem}
                            groupSeparator={group.separator || groupSeparator}
                        />
                    )
                    : renderList.map(renderThisItem)
            }
            {
                (displayRow || displayGrid || display.grid || display.row)
                && <DisplayHandler {...{display, displayRow, rowGap, displayGrid, gridGap, minColumnWidth}}/>
            }
            {((loadMoreItems || pagination.loadMore) && !renderOnScroll)
            && (
                <InfiniteLoader
                    itemsCount={renderList.length}
                    hasMore={hasMoreItems || pagination.hasMore}
                    loadMore={loadMoreItems || pagination.loadMore}
                    loadingIndicator={paginationLoadingIndicator || pagination.loadingIndicator}
                    loadingIndicatorPosition={paginationLoadingIndicatorPosition || pagination.loadingIndicatorPosition}
                />
            )}
        </>
    );

    const showScrollToTopButton = (scrollToTop === true || (scrollToTop as ScrollToTopInterface).button || scrollToTopButton);

    let WrapperElement = '';

    if ((isString(wrapperHtmlTag) && wrapperHtmlTag) || showScrollToTopButton) {
        WrapperElement = wrapperHtmlTag || 'div';
    }

    return (
        <>
            {
                WrapperElement
                    // @ts-ignore
                    ? <WrapperElement ref={__forwarededRef} {...tagProps}>{content}</WrapperElement>
                    : content
            }
            {
                showScrollToTopButton
                && (
                    <ScrollToTopButton
                        button={scrollToTopButton}
                        padding={scrollToTopPadding}
                        offset={scrollToTopOffset}
                        position={scrollToTopPosition}
                        scrollingContainer={__forwarededRef}
                    />
                )
            }
        </>
    );
}

FlatList.propTypes = propTypes;

FlatList.defaultProps = defaultProps;

// export default FlatList;
export default forwardRef<HTMLElement, PlainListProps<any>>(
    <ListItem,>(props: PlainListProps<ListItem>, ref: Ref<HTMLElement>) => (
        <FlatList __forwarededRef={ref} {...props} />
    )
) as <ListItem,>(props: FlatListProps<ListItem>) => JSX.Element;
