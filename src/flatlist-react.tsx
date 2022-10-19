import React, {forwardRef, memo, Ref, createRef} from 'react';
import DisplayHandler, {DisplayInterface} from './___subComponents/DisplayHandler';
import InfiniteLoader, {InfiniteLoaderInterface} from './___subComponents/InfiniteLoader';
import ScrollRenderer from './___subComponents/ScrollRenderer';
import ScrollToTopButton from './___subComponents/ScrollToTopButton';
import {handleRenderGroupSeparator, handleRenderItem, renderBlank, renderFunc} from './___subComponents/uiFunctions';
import withList from './___subComponents/withList';
import {isString} from './___utils/isType';
import {defaultProps, FlatListProps, GroupInterface, propTypes, ScrollToTopInterface} from './flatListProps';

function FlatList(props: FlatListProps): JSX.Element {
    const {
        list, renderWhenEmpty, wrapperHtmlTag, renderItem = null, renderOnScroll, // render/list related props
        group = {} as GroupInterface, groupSeparator, // group props
        display = {} as DisplayInterface, displayRow, rowGap, displayGrid, gridGap, minColumnWidth, // display props,
        hasMoreItems, loadMoreItems, paginationLoadingIndicator, paginationLoadingIndicatorPosition,
        scrollToTop, scrollToTopButton, scrollToTopPadding, scrollToTopOffset, scrollToTopPosition,
        pagination = {} as InfiniteLoaderInterface, // pagination props
        __forwarededRef,
        ...otherProps
    } = props;
    const tagProps = Object.keys(otherProps)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((k: string) => ((defaultProps as any)[k] === undefined))
        .reduce((p, k: string) => ({...p, [k]: otherProps[k]}), {});

    const renderThisItem = handleRenderItem(
        renderItem,
        handleRenderGroupSeparator(group.separator || groupSeparator)
    );

    const content = (
        <>
            {
                list.length > 0
                    ? (renderOnScroll && !(loadMoreItems || pagination.loadMore))
                        ? (
                            <ScrollRenderer
                                list={list}
                                renderItem={renderItem}
                                groupSeparator={group.separator || groupSeparator}
                            />
                        )
                        : list.map((item, index) => (renderThisItem as renderFunc)(item, (item as {id: string | number}).id ?? index))
                    : renderBlank(renderWhenEmpty)
            }
            {
                (displayRow || displayGrid || display.grid || display.row)
                && <DisplayHandler {...{display, displayRow, rowGap, displayGrid, gridGap, minColumnWidth}}/>
            }
            {((loadMoreItems || pagination.loadMore) && !renderOnScroll)
            && (
                <InfiniteLoader
                    itemsCount={list.length}
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

export default memo<FlatListProps>(withList(forwardRef((props: FlatListProps, ref: Ref<HTMLElement>) => {
    ref = ref || createRef();
    return (
        <FlatList {...props} __forwarededRef={ref}/>
    );
})));
