import React, {Fragment, memo} from 'react';
import {array, func, oneOfType, string, bool, node, element, number} from 'prop-types';
import filterList from './utils/filterList';
import sortList from './utils/sortList';
import searchList, {SearchOptionsInterface} from './utils/searchList';
import groupList, {GroupOptionsInterface} from './utils/groupList';
import {isFunction} from './utils/isType';
import limitList from './utils/limitList';
import DefaultBlank from './subComponents/DefaultBlank';
import DisplayHandler, {DisplayHandlerProps} from './subComponents/DisplayHandler';

interface Props {
    list: any[];
    sortBy?: string;
    sortGroupBy?: string;
    sortDesc?: boolean;
    sortGroupDesc?: boolean;
    showGroupSeparatorAtTheBottom?: boolean;
    limit?: number;
    sort?: boolean;
    displayRow?: boolean;
    rowGap?: string;
    displayGrid?: boolean;
    gridGap?: string;
    minColumnWidth?: string;
    groupSeparator?: null | any;
    dontSortOnGroup?: boolean;
    sortCaseInsensitive?: boolean;
    renderItem: (item: any, idx: number | string) => any;
    renderWhenEmpty?: null | (() => any);
    filterBy?: string | ((item: any, idx: number) => boolean);
    searchTerm?: SearchOptionsInterface['term'];
    searchBy?: SearchOptionsInterface['by'];
    searchOnEveryWord?: SearchOptionsInterface['everyWord'];
    searchCaseInsensitive?: SearchOptionsInterface['caseInsensitive'];
    groupBy?: GroupOptionsInterface['by'];
    groupOf?: GroupOptionsInterface['limit'];
}

const FlatList = (props: Props) => {
    const {
        list, renderItem, limit, renderWhenEmpty, // render/list related props
        filterBy, // filter props
        groupBy, groupSeparator, groupOf, showGroupSeparatorAtTheBottom, // group props
        sortBy, sortDesc, sort, sortCaseInsensitive, sortGroupBy, sortGroupDesc, // sort props
        searchBy, searchOnEveryWord, searchTerm, searchCaseInsensitive, // search props
        ...displayProps
    } = props;

    let renderList = limitList([...list], limit);

    const renderBlank = () => {
        return (renderWhenEmpty && isFunction(renderWhenEmpty) ? renderWhenEmpty() : DefaultBlank);
    };

    if (renderList.length === 0) {
        return renderBlank();
    }

    const renderGroupedList = () => {
        const groupingOptions: GroupOptionsInterface = {
            by: groupBy,
            limit: groupOf
        };

        const {groupLists, groupLabels} = groupList(renderList, groupingOptions);

        return groupLists
                .reduce((groupedList, group, idx: number) => {
                    const separatorKey = `separator-${idx}`;

                    let separator = (<hr key={separatorKey} className='___list-separator'/>);

                    if (groupSeparator) {
                        separator = isFunction(groupSeparator) ?
                            groupSeparator(group, idx, groupLabels[idx]) : groupSeparator;

                        separator = (
                            <separator.type
                                {...separator.props}
                                key={separatorKey}
                                className={`${separator.props.className} ___list-separator`}
                            />
                        );
                    }

                    if (sort || sortGroupBy) {
                        group = sortList(group, {
                            caseInsensitive: sortCaseInsensitive,
                            descending: sortGroupDesc,
                            onKey: sortGroupBy
                        });
                    }

                    const groupedItems = group.map((item: any, i: number) => renderItem(item, `${idx}-${i}`));

                    if (showGroupSeparatorAtTheBottom) {
                        return groupedList.concat(...groupedItems, separator);
                    }

                    return groupedList.concat(separator, ...groupedItems);
                }, []);
    };

    if (filterBy) {
        renderList = filterList(renderList, filterBy);
    }

    if (searchTerm && searchBy) {
        renderList = searchList(renderList, {
            by: searchBy,
            caseInsensitive: searchCaseInsensitive,
            everyWord: searchOnEveryWord,
            term: searchTerm
        });
    }

    if (sort || sortBy) {
        renderList = sortList(renderList, {
            caseInsensitive: sortCaseInsensitive,
            descending: sortDesc,
            onKey: sortBy
        });
    }

    return (
        <Fragment>
            {
                renderList.length > 0 ?
                    (groupBy || groupOf) ? renderGroupedList() : renderList.map(renderItem) :
                    renderBlank()
            }
            <DisplayHandler
                {...(displayProps as DisplayHandlerProps)}
                showGroupSeparatorAtTheBottom={showGroupSeparatorAtTheBottom || false}
            />
        </Fragment>
    );
};

FlatList.propTypes = {
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
     * a string representing a key on the object or a function takes the item and its index that returns
     * true or false whether to include the item or not
     */
    groupBy: oneOfType([func, string]),
    /**
     * the size of the groups to be created
     */
    groupOf: number,
    /**
     * a component or a function that returns a component to be rendered in between groups
     */
    groupSeparator: oneOfType([node, func, element]),
    /**
     * the number representing the max number of items to display
     */
    limit: number,
    /**
     * a list of anything to be displayed
     */
    list: array.isRequired,
    /**
     * the minimum column width when display grid is activated
     */
    minColumnWidth: string,
    /**
     * the function that it is called for every item on the list and returns a component
     */
    renderItem: func.isRequired,
    /**
     * the function that gets called when the list is empty or was filtered to the point it became empty
     */
    renderWhenEmpty: func,
    /**
     * the spacing in between rows when display row is activated
     */
    rowGap: string,
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
    sort: bool,
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
    sortGroupDesc: bool
};

FlatList.defaultProps = {
    displayGrid: false,
    displayRow: false,
    filterBy: '',
    gridGap: '20px',
    groupBy: '',
    groupOf: 0,
    groupSeparator: null,
    minColumnWidth: '200px',
    renderWhenEmpty: null,
    rowGap: '20px',
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
};

export default memo(FlatList);
