import React, {Fragment, memo, forwardRef, Ref, ForwardRefExoticComponent} from 'react';
import {array, func, oneOfType, string, bool, node, element, number, shape, object, oneOf} from 'prop-types';
import filterList from './utils/filterList';
import sortList from './utils/sortList';
import searchList, {SearchOptionsInterface} from './utils/searchList';
import groupList, {GroupOptionsInterface} from './utils/groupList';
import {isFunction, isBoolean} from './utils/isType';
import convertListToArray from './utils/convertListToArray';
import limitList from './utils/limitList';
import DefaultBlank from './subComponents/DefaultBlank';
import DisplayHandler, {DisplayHandlerProps, DisplayInterface} from './subComponents/DisplayHandler';
import InfiniteLoader, {InfiniteLoaderInterface} from './subComponents/InfiniteLoader';

interface GroupInterface extends GroupOptionsInterface {
    separator: JSX.Element | ((g: any, idx: number, label: string) => JSX.Element | null) | null;
    separatorAtTheBottom: boolean;
    sortBy: string;
    sortDescending: boolean;
    sortCaseInsensitive: boolean;
}

interface SortInterface {
    by: string;
    descending: boolean;
    caseInsensitive: boolean;
    groupBy: GroupInterface['sortBy'];
    groupDescending: GroupInterface['sortDescending'];
    groupCaseInsensitive: GroupInterface['sortCaseInsensitive'];
}

interface Props {
    list: any[];
    renderItem: JSX.Element | ((item: any, idx: number | string) => JSX.Element | null);
    renderWhenEmpty: null | (() => JSX.Element);
    limit: number;
    reversed: boolean;
    wrapperHtmlTag: string;
    // shorthands
    group: GroupInterface;
    search: SearchOptionsInterface;
    display: DisplayInterface;
    sort: boolean | SortInterface;
    pagination: InfiniteLoaderInterface;
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
    filterBy: string | ((item: any, idx: number) => boolean);
    // searching
    searchTerm: SearchOptionsInterface['term'];
    searchBy: SearchOptionsInterface['by'];
    searchOnEveryWord: SearchOptionsInterface['everyWord'];
    searchCaseInsensitive: SearchOptionsInterface['caseInsensitive'];
    // pagination
    hasMoreItems: InfiniteLoaderInterface['hasMore'];
    loadMoreItems: null | InfiniteLoaderInterface['loadMore'];
    paginationLoadingIndicator: InfiniteLoaderInterface['loadingIndicator'];
    paginationLoadingIndicatorPosition: InfiniteLoaderInterface['loadingIndicatorPosition'];
}

// this interface is to deal with the fact that ForwardRefExoticComponent does not have the propTypes
interface ForwardRefExoticComponentExtended extends ForwardRefExoticComponent<Props> {
    propTypes: object;
}

const FlatList = forwardRef((props: Props, ref: Ref<HTMLElement>) => {
    const {
        renderItem, limit, reversed, renderWhenEmpty, wrapperHtmlTag, // render/list related props
        filterBy, // filter props
        groupBy, groupSeparator, groupOf, showGroupSeparatorAtTheBottom, groupReversed, // group props
        sortBy, sortDesc, sort, sortCaseInsensitive, sortGroupBy, sortGroupDesc, // sort props
        searchBy, searchOnEveryWord, searchTerm, searchCaseInsensitive, // search props
        display, displayRow, rowGap, displayGrid, gridGap, minColumnWidth, // display props,
        hasMoreItems, loadMoreItems, paginationLoadingIndicator, paginationLoadingIndicatorPosition,
        pagination, // pagination props
        ...otherProps // props to be added to the wrapper container if wrapperHtmlTag is specified
    } = props;
    // tslint:disable-next-line:prefer-const
    let {list, group, search, ...tagProps} = otherProps;

    list = convertListToArray(list);

    const renderBlank = (): JSX.Element => {
        return (renderWhenEmpty && isFunction(renderWhenEmpty) ? renderWhenEmpty() : DefaultBlank);
    };

    if (list.length === 0) {
        return renderBlank();
    }

    let renderList = [...list];

    if (reversed) {
        renderList = renderList.reverse();
    }

    if (limit !== null) {
        renderList = limitList(renderList, limit);
    }

    const handleRenderItem = (item: any, key: number | string) => {
        if (isFunction(renderItem)) {
            return (renderItem as (item: any, idx: number | string) => JSX.Element)(item, key);
        }

        const comp = renderItem as JSX.Element;
        return (<comp.type{...comp.props} key={key} item={item}/>);
    };

    const renderGroupedList = () => {
        // make sure group always has the defaults
        group = {
            ...(FlatList.defaultProps && FlatList.defaultProps.group),
            ...group
        };

        const groupingOptions: GroupOptionsInterface = {
            by: group.by || groupBy,
            limit: group.limit || groupOf,
            reversed: group.reversed || groupReversed
        };

        const {groupLists, groupLabels} = groupList(renderList, groupingOptions);

        return groupLists
                .reduce((groupedList, aGroup, idx: number) => {
                    const customSeparator = group.separator || groupSeparator;
                    const separatorKey = `separator-${idx}`;
                    let separator = (<hr key={separatorKey} className='___list-separator'/>);

                    if (customSeparator) {
                        if (isFunction(customSeparator)) {
                            separator = (customSeparator as (g: any, idx: number, label: string) => JSX.Element)
                            (aGroup, idx, groupLabels[idx]);
                        } else {
                            separator = customSeparator as JSX.Element;
                        }

                        separator = (
                            <separator.type
                                {...separator.props}
                                key={separatorKey}
                                className={`${separator.props.className || ''} ___list-separator`.trim()}
                            />
                        );
                    }

                    if (group.sortBy || sortGroupBy || (sort as SortInterface).groupBy) {
                        aGroup = sortList(aGroup, {
                            caseInsensitive: group.sortCaseInsensitive ||
                                sortCaseInsensitive || (sort as SortInterface).groupCaseInsensitive,
                            descending: group.sortDescending ||
                                sortGroupDesc || (sort as SortInterface).groupDescending,
                            onKey: group.sortBy || sortGroupBy || (sort as SortInterface).groupBy
                        });
                    }

                    const groupedItems = aGroup
                        .map((item: any, i: number) => handleRenderItem(item, `${idx}-${i}`));

                    if (group.separatorAtTheBottom || showGroupSeparatorAtTheBottom) {
                        return groupedList.concat(...groupedItems, separator);
                    }

                    return groupedList.concat(separator, ...groupedItems);
                }, []);
    };

    if (filterBy) {
        renderList = filterList(renderList, filterBy);
    }

    if ((searchTerm && searchBy) || (search.term && search.by)) {
        // make sure search always has the defaults
        search = {
            ...(FlatList.defaultProps && FlatList.defaultProps.search),
            ...search
        };

        renderList = searchList(renderList, {
            by: search.by || searchBy,
            caseInsensitive: search.caseInsensitive || searchCaseInsensitive,
            everyWord: search.everyWord || searchOnEveryWord,
            term: search.term || searchTerm
        });
    }

    const {caseInsensitive, by, descending} = sort as SortInterface;
    if (by || sortBy || (isBoolean(sort) && sort)) {
        renderList = sortList(renderList, {
            caseInsensitive: caseInsensitive || sortCaseInsensitive,
            descending: descending || sortDesc,
            onKey: by || sortBy
        });
    }

    const content = (
        <Fragment>
            {
                renderList.length > 0 ?
                    (group.by || group.limit || groupBy || groupOf) ?
                        renderGroupedList() :
                        renderList.map(handleRenderItem) :
                    renderBlank()
            }
            <DisplayHandler
                {...{display, displayRow, rowGap, displayGrid, gridGap, minColumnWidth}}
                showGroupSeparatorAtTheBottom={group.separatorAtTheBottom || showGroupSeparatorAtTheBottom}
            />
            {(loadMoreItems || pagination.loadMore) &&
                <InfiniteLoader
                  hasMore={hasMoreItems || pagination.hasMore}
                  loadMore={loadMoreItems || pagination.loadMore}
                  loadingIndicator={paginationLoadingIndicator || pagination.loadingIndicator}
                  loadingIndicatorPosition={paginationLoadingIndicatorPosition || pagination.loadingIndicatorPosition}
                />}
        </Fragment >
    );

    const WrapperElement = `${wrapperHtmlTag}`;

    return (
        <Fragment>
            {
                WrapperElement ?
                    // @ts-ignore
                    <WrapperElement ref={ref}{...tagProps}>{content}</WrapperElement> :
                    content
            }
        </Fragment>
    );
}) as ForwardRefExoticComponentExtended;

FlatList.propTypes = {
    /**
     * display shorthand configuration
     */
    display: shape({
        grid: bool,
        gridColumnWidth: string,
        gridGap: string,
        row: bool,
        rowGap: string,
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
        sortBy: string,
        sortCaseInsensitive: bool,
        sortDescending: bool,
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
    /**
     * the spacing in between rows when display row is activated
     */
    rowGap: string,
    /**
     * a search shorthand configuration
     */
    search: shape({
        by: oneOfType([func, string]),
        caseInsensitive: bool,
        everyWord: bool,
        term: string
    }),
    /**
     * a string representing a key on the object or a function takes the item and its index that returns
     * true or false whether to include the item or not
     */
    searchBy: oneOfType([func, string]),
    /**
     * a flag that indicates whether to make search case insensitive or not
     */
    searchCaseInsensitive: bool,
    /**
     * a flag that indicates how the search should be done. By default is set to True
     */
    searchOnEveryWord: bool,
    /**
     * a string representing the term to match when doing search or that will be passed to searchBy function
     */
    searchTerm: string,
    /**
     * a flag to indicate whether the separator should be on the bottom or not
     */
    showGroupSeparatorAtTheBottom: bool,
    /**
     * a flag to indicate that the list should be sorted (uses default sort configuration)
     */
    sort: oneOfType([bool, shape({
        by: string,
        caseInsensitive: bool,
        descending: bool,
        groupBy: string,
        groupCaseInsensitive: bool,
        groupDescending: bool,
    })]),
    /**
     * a string representing a key in the item that should be used to sort the list
     */
    sortBy: string,
    /**
     * a flag to indicate that sort should be done in descending order
     */
    sortDesc: bool,
    /**
     * a string representing a key in the item that should be used to sort the list groups
     */
    sortGroupBy: string,
    /**
     * a flag to indicate that sort should be done in descending order inside each group
     */
    sortGroupDesc: bool,
    /**
     * a optional html tag to use to wrap the list items
     */
    wrapperHtmlTag: string
};

FlatList.defaultProps = {
    display: {
        grid: false,
        gridGap: '',
        gridMinColumnWidth: '',
        row: false,
        rowGap: '',
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
        sortDescending: false,
    },
    groupBy: '',
    groupOf: 0,
    groupReversed: false,
    groupSeparator: null,
    hasMoreItems: false,
    limit: 0,
    loadMoreItems: null,
    minColumnWidth: '',
    paginationLoadingIndicator: undefined,
    paginationLoadingIndicatorPosition: '',
    renderWhenEmpty: null,
    reversed: false,
    rowGap: '',
    search: {
        by: '',
        caseInsensitive: false,
        everyWord: false,
        term: ''
    },
    searchBy: '',
    searchCaseInsensitive: false,
    searchOnEveryWord: false,
    searchTerm: '',
    showGroupSeparatorAtTheBottom: false,
    sort: false,
    sortBy: '',
    sortCaseInsensitive: false,
    sortDesc: false,
    sortGroupBy: '',
    sortGroupDesc: false,
    wrapperHtmlTag: '',
};

export default memo(FlatList);
