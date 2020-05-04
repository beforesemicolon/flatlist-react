import {array, arrayOf, bool, element, func, node, number, object, oneOf, oneOfType, shape, string} from 'prop-types';
import React, {forwardRef, memo} from 'react';
import DisplayHandler, {DisplayHandlerProps, DisplayInterface} from './___subComponents/DisplayHandler';
import InfiniteLoader, {InfiniteLoaderProps} from './___subComponents/InfiniteLoader';
import ScrollRenderer from './___subComponents/ScrollRenderer';
import ScrollToTopButton from './___subComponents/ScrollToTopButton';
import {handleRenderGroupSeparator, handleRenderItem, renderBlank, renderFunc} from './___subComponents/uiFunctions';
import withList from './___subComponents/withList';
import {GroupOptionsInterface} from './___utils/groupList';
import {isString} from './___utils/isType';
import {SearchOptionsInterface} from './___utils/searchList';
import {SortOptionsInterface} from './___utils/sortList';

interface GroupInterface extends GroupOptionsInterface {
    separator: JSX.Element | ((g: any, idx: number, label: string) => JSX.Element | null) | null;
    separatorAtTheBottom: boolean;
    sortBy: SortOptionsInterface['by'];
    sortDescending: boolean;
    sortCaseInsensitive: boolean;
}

interface SortInterface extends SortOptionsInterface {
    groupBy: GroupInterface['sortBy'];
    groupDescending: GroupInterface['sortDescending'];
    groupCaseInsensitive: GroupInterface['sortCaseInsensitive'];
}

interface Props<T> {
    list: T[];
    renderItem: JSX.Element | renderFunc;
    renderWhenEmpty: null | (() => JSX.Element);
    renderScroll: boolean;
    limit: number;
    reversed: boolean;
    wrapperHtmlTag: string;
    __forwarededRef: object;
    // shorthands
    group: GroupInterface;
    search: SearchOptionsInterface<T>;
    display: DisplayInterface;
    sort: boolean | SortInterface;
    pagination: InfiniteLoaderProps;
    scrollToTop: boolean;
    // sorting
    sortBy: SortInterface['by'];
    sortCaseInsensitive: SortInterface['caseInsensitive'];
    sortDesc: SortInterface['descending'];
    sortGroupBy: GroupInterface['sortBy'];
    sortGroupDesc: GroupInterface['sortDescending'];
    // grouping
    showGroupSeparatorAtTheBottom: GroupInterface['separatorAtTheBottom'];
    groupReversed: GroupInterface['reversed'];
    groupSeparator: GroupInterface['separator'];
    groupBy: GroupInterface['by'];
    groupOf: GroupInterface['limit'];
    // display
    displayRow: DisplayHandlerProps['displayRow'];
    rowGap: DisplayHandlerProps['rowGap'];
    displayGrid: DisplayHandlerProps['displayGrid'];
    gridGap: DisplayHandlerProps['gridGap'];
    minColumnWidth: DisplayHandlerProps['minColumnWidth'];
    // filtering
    filterBy: string | ((item: T, idx: number) => boolean);
    // searching
    searchTerm: SearchOptionsInterface<T>['term'];
    searchBy: SearchOptionsInterface<T>['by'];
    searchOnEveryWord: SearchOptionsInterface<T>['everyWord'];
    searchCaseInsensitive: SearchOptionsInterface<T>['caseInsensitive'];
    searchableMinCharactersCount: SearchOptionsInterface<T>['minCharactersCount'];
    // pagination
    hasMoreItems: InfiniteLoaderProps['hasMore'];
    loadMoreItems: null | InfiniteLoaderProps['loadMore'];
    paginationLoadingIndicator: InfiniteLoaderProps['loadingIndicator'];
    paginationLoadingIndicatorPosition: InfiniteLoaderProps['loadingIndicatorPosition'];
    // scrollToTop
    scrollToTopButton: JSX.Element | (() => JSX.Element);
    scrollToTopOffset: number;
    scrollToTopPadding: number;
    scrollToTopPosition: string;
}

const FlatList = (props: Props<{} | []>) => {
    const {
        list, limit, reversed, renderWhenEmpty, wrapperHtmlTag, renderItem, // render/list related props
        filterBy, // filter props
        group, groupBy, groupSeparator, groupOf, showGroupSeparatorAtTheBottom, groupReversed, // group props
        sortBy, sortDesc, sort, sortCaseInsensitive, sortGroupBy, sortGroupDesc, // sort props
        search, searchBy, searchOnEveryWord, searchTerm, searchCaseInsensitive, searchableMinCharactersCount, // search props
        display, displayRow, rowGap, displayGrid, gridGap, minColumnWidth, // display props,
        hasMoreItems, loadMoreItems, paginationLoadingIndicator, paginationLoadingIndicatorPosition,
        renderScroll, scrollToTop, scrollToTopButton, scrollToTopOffset, scrollToTopPadding, scrollToTopPosition,
        pagination, // pagination props
        __forwarededRef, ...tagProps // props to be added to the wrapper container if wrapperHtmlTag is specified
    } = props;

    const renderThisItem = handleRenderItem(
        renderItem,
        handleRenderGroupSeparator(group.separator || groupSeparator)
    );

    const content = (
        <>
            {
                list.length > 0
                    ? renderScroll
                        ? <ScrollRenderer list={list} renderItem={renderItem} groupSeparator={group.separator || groupSeparator}/>
                        : list.map(renderThisItem)
                    : renderBlank(renderWhenEmpty)
            }
            <DisplayHandler
                {...{display, displayRow, rowGap, displayGrid, gridGap, minColumnWidth}}
                showGroupSeparatorAtTheBottom={group.separatorAtTheBottom || showGroupSeparatorAtTheBottom}
            />
            {(loadMoreItems || pagination.loadMore)
            && (
                <InfiniteLoader
                    hasMore={hasMoreItems || pagination.hasMore}
                    loadMore={loadMoreItems || pagination.loadMore}
                    loadingIndicator={paginationLoadingIndicator || pagination.loadingIndicator}
                    loadingIndicatorPosition={paginationLoadingIndicatorPosition || pagination.loadingIndicatorPosition}
                />
            )}
            {(scrollToTop || scrollToTopButton) && <ScrollToTopButton button={scrollToTopButton}/>}
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

FlatList.propTypes = {
    /**
     * display shorthand configuration
     */
    display: shape({
        grid: bool,
        gridColumnWidth: string,
        gridGap: string,
        row: bool,
        rowGap: string
    }),
    /**
     * activate display grid on the items container
     */
    displayGrid: bool,
    /**
     * activate display block on items and items container
     */
    displayRow: bool,
    /**
     * a string representing a key on the object or a function takes the item and its index that returns
     * true or false whether to include the item or not
     */
    filterBy: oneOfType([func, string]),
    /**
     * the spacing in between columns and rows. Similar to CSS grid-gap
     */
    gridGap: string,
    /**
     * a group shorthand configuration
     */
    group: shape({
        by: oneOfType([func, string]),
        limit: number,
        reversed: bool,
        separator: oneOfType([node, func, element]),
        separatorAtTheBottom: bool,
        sortBy: oneOfType([
            string,
            arrayOf(oneOfType([string, shape({by: string, caseInsensitive: bool, descending: bool})]))
        ]),
        sortCaseInsensitive: bool,
        sortDescending: bool
    }),
    /**
     * a string representing a key on the object or a function takes the item and its index that returns
     * true or false whether to include the item or not
     */
    groupBy: oneOfType([func, string]),
    /**
     * the size of the groups to be created
     */
    groupOf: number,
    /**
     * a flag to read groups backwards(in reverse)
     */
    groupReversed: bool,
    /**
     * a component or a function that returns a component to be rendered in between groups
     */
    groupSeparator: oneOfType([node, func, element]),
    /**
     * a flag to indicate whether there are more items to the list that can be loaded
     */
    hasMoreItems: bool,
    /**
     * the number representing the max number of items to display
     */
    limit: number,
    /**
     * a list of anything to be displayed
     */
    list: oneOfType([array, object]).isRequired,
    /**
     * a function to be called when list has been scrolled to the end
     */
    loadMoreItems: func,
    /**
     * the minimum column width when display grid is activated
     */
    minColumnWidth: string,
    /**
     * a pagination shorthand configuration
     */
    pagination: shape({
        hasMore: bool,
        loadMore: func,
        loadingIndicator: oneOfType([node, func, element]),
        loadingIndicatorPosition: string
    }),
    /**
     * a custom element to be used instead of the default loading indicator for pagination
     */
    paginationLoadingIndicator: oneOfType([node, func, element]),
    /**
     * the position of the custom loader indicator
     */
    paginationLoadingIndicatorPosition: oneOf(['left', 'center', 'right', '']),
    /**
     * a jsx element or a function that it is called for every item on the list and returns a jsx element
     */
    renderItem: oneOfType([func, node]).isRequired,
    /**
     * the function that gets called when the list is empty or was filtered to the point it became empty
     */
    renderWhenEmpty: func,
    /**
     * a flag to read the given list backwards(in reverse)
     */
    reversed: bool,
    renderScroll: bool,
    /**
     * the spacing in between rows when display row is activated
     */
    rowGap: string,
    /**
     * a button to be used as scroll to top
     */
    scrollToTopButton: oneOfType([node, element, func]),
    /**
     * a button to be used as scroll to top
     */
    scrollToTopOffset: number,
    /**
     * a button to be used as scroll to top
     */
    scrollToTopPadding: number,
    scrollToTopPosition: oneOf(['top right', 'top left', 'bottom right', 'bottom left']),
    /**
     * a search shorthand configuration
     */
    search: shape({
        by: oneOfType([
            func, string,
            arrayOf(oneOfType([string, shape({by: string, caseInsensitive: bool})]))
        ]),
        caseInsensitive: bool,
        everyWord: bool,
        searchableMinCharactersCount: number,
        term: string
    }),
    /**
     * a string representing a key on the object or a function takes the item and its index that returns
     * true or false whether to include the item or not
     */
    searchBy: oneOfType([
        func, string,
        arrayOf(oneOfType([string, shape({by: string, caseInsensitive: bool})]))
    ]),
    /**
     * a flag that indicates whether to make search case insensitive or not
     */
    searchCaseInsensitive: bool,
    /**
     * a flag that indicates how the search should be done. By default is set to True
     */
    searchOnEveryWord: bool,
    /**
     * minimum characters needed to start the search
     */
    searchableMinCharactersCount: number,
    /**
     * a string representing the term to match when doing search or that will be passed to searchBy function
     */
    searchTerm: string,
    /**
     * a flag to indicate whether the separator should be on the bottom or not
     */
    showGroupSeparatorAtTheBottom: bool,
    /**
     * a flag to indicate whether to sort insensitive or not
     */
    sortCaseInsensitive: bool,
    /**
     * a flag to indicate that the list should be sorted (uses default sort configuration)
     */
    sort: oneOfType([bool, shape({
        by: oneOfType([
            string,
            arrayOf(oneOfType([string, shape({by: string, caseInsensitive: bool, descending: bool})]))
        ]),
        caseInsensitive: bool,
        descending: bool,
        groupBy: string,
        groupCaseInsensitive: bool,
        groupDescending: bool
    })]),
    /**
     * a string representing a key in the item that should be used to sort the list
     */
    sortBy: oneOfType([
        string,
        arrayOf(oneOfType([string, shape({by: string, caseInsensitive: bool, descending: bool})]))
    ]),
    /**
     * a flag to indicate that sort should be done in descending order
     */
    sortDesc: bool,
    /**
     * a string representing a key in the item that should be used to sort the list groups
     */
    sortGroupBy: oneOfType([
        string,
        arrayOf(oneOfType([string, shape({by: string, caseInsensitive: bool, descending: bool})]))
    ]),
    /**
     * a flag to indicate that sort should be done in descending order inside each group
     */
    sortGroupDesc: bool,
    /**
     * a optional html tag to use to wrap the list items
     */
    wrapperHtmlTag: string,
    // eslint-disable-next-line react/forbid-prop-types
    __forwarededRef: object
};

FlatList.defaultProps = {
    display: {
        grid: false,
        gridGap: '',
        gridMinColumnWidth: '',
        row: false,
        rowGap: ''
    },
    displayGrid: false,
    displayRow: false,
    filterBy: '',
    gridGap: '',
    group: {
        by: '',
        limit: 0,
        reversed: false,
        separator: null,
        separatorAtTheBottom: false,
        sortBy: '',
        sortCaseInsensitive: false,
        sortDescending: false
    },
    groupBy: '',
    groupOf: 0,
    groupReversed: false,
    groupSeparator: null,
    hasMoreItems: false,
    limit: 0,
    loadMoreItems: null,
    minColumnWidth: '',
    pagination: {
        hasMore: false,
        loadMore: null,
        loadingIndicator: null,
        loadingIndicatorPosition: ''
    },
    paginationLoadingIndicator: undefined,
    paginationLoadingIndicatorPosition: '',
    renderWhenEmpty: null,
    reversed: false,
    rowGap: '',
    renderScroll: false,
    scrollToTopButton: null,
    scrollToTopOffset: 50,
    scrollToTopPadding: 20,
    scrollToTopPosition: 'bottom right',
    search: {
        by: '',
        caseInsensitive: false,
        everyWord: false,
        searchableMinCharactersCount: 0,
        term: ''
    },
    searchBy: '',
    searchCaseInsensitive: false,
    searchOnEveryWord: false,
    searchTerm: '',
    showGroupSeparatorAtTheBottom: false,
    searchableMinCharactersCount: 0,
    sort: false,
    sortBy: '',
    sortCaseInsensitive: false,
    sortDesc: false,
    sortGroupBy: '',
    sortGroupDesc: false,
    wrapperHtmlTag: '',
    __forwarededRef: {}
};

export default memo(withList(forwardRef((props: Props<{} | []>, ref: any) => (
    <FlatList {...props} __forwarededRef={ref}/>
))));
