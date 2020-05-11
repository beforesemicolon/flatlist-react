import React, {forwardRef, memo, Ref} from 'react';
import DisplayHandler from './___subComponents/DisplayHandler';
import InfiniteLoader from './___subComponents/InfiniteLoader';
import ScrollRenderer from './___subComponents/ScrollRenderer';
import ScrollToTopButton from './___subComponents/ScrollToTopButton';
import {handleRenderGroupSeparator, handleRenderItem, renderBlank} from './___subComponents/uiFunctions';
import withList from './___subComponents/withList';
import {isString} from './___utils/isType';
import {defaultProps, Props, propTypes, ScrollToTopInterface} from './props';

const FlatList = (props: Props<{} | []>): JSX.Element => {
    const {
        list, renderWhenEmpty, wrapperHtmlTag, renderItem, // render/list related props
        group, groupSeparator, showGroupSeparatorAtTheBottom, // group props
        display, displayRow, rowGap, displayGrid, gridGap, minColumnWidth, // display props,
        hasMoreItems, loadMoreItems, paginationLoadingIndicator, paginationLoadingIndicatorPosition,
        renderScroll, scrollToTop, scrollToTopButton, scrollToTopPadding, scrollToTopOffset, scrollToTopPosition,
        pagination, // pagination props
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
                    ? (renderScroll && !(loadMoreItems || pagination.loadMore))
                        ? (
                            <ScrollRenderer
                                list={list}
                                renderItem={renderItem}
                                groupSeparator={group.separator || groupSeparator}
                            />
                        )
                        : list.map(renderThisItem)
                    : renderBlank(renderWhenEmpty)
            }
            {
                (displayRow || displayGrid || display.grid || display.row)
                && <DisplayHandler {...{display, displayRow, rowGap, displayGrid, gridGap, minColumnWidth}}/>
            }
            {((loadMoreItems || pagination.loadMore) && !renderScroll)
            && (
                <InfiniteLoader
                    hasMore={hasMoreItems || pagination.hasMore}
                    loadMore={loadMoreItems || pagination.loadMore}
                    loadingIndicator={paginationLoadingIndicator || pagination.loadingIndicator}
                    loadingIndicatorPosition={paginationLoadingIndicatorPosition || pagination.loadingIndicatorPosition}
                />
            )}
            {
                (scrollToTop === true || (scrollToTop as ScrollToTopInterface).button || scrollToTopButton)
                && (
                    <ScrollToTopButton
                        button={scrollToTopButton}
                        padding={scrollToTopPadding}
                        offset={scrollToTopOffset}
                        position={scrollToTopPosition}
                    />
                )
            }
        </>
    );

    const WrapperElement = `${isString(wrapperHtmlTag) && wrapperHtmlTag ? wrapperHtmlTag : ''}`;

    return (
        <>
            {
                WrapperElement
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    ? <WrapperElement ref={__forwarededRef} {...tagProps}>{content}</WrapperElement>
                    : content
            }
        </>
    );
};

FlatList.propTypes = propTypes;

FlatList.defaultProps = defaultProps;

export default memo(withList(forwardRef((props: Props<{} | []>, ref: Ref<HTMLElement>) => (
    <FlatList {...props} __forwarededRef={ref}/>
))));
