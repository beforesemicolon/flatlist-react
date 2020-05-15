import React, {forwardRef, memo} from 'react';
import convertListToArray from '../___utils/convertListToArray';
import filterList from '../___utils/filterList';
import groupList from '../___utils/groupList';
import {isBoolean, isNil} from '../___utils/isType';
import limitList from '../___utils/limitList';
import reverseList from '../___utils/reverseList';
import searchList from '../___utils/searchList';
import sortList from '../___utils/sortList';
import {defaultProps} from '../props';
import {renderBlank} from './uiFunctions';

const withList = (List: any) => {
    const DataList = (props: any) => {
        const {
            list, limit, reversed, renderWhenEmpty, // render/list related props
            filterBy, // filter props
            group, groupBy, groupOf, showGroupSeparatorAtTheBottom, groupReversed, groupSeparatorAtTheBottom,
            groupSortedCaseInsensitive, groupSortedDescending, groupSorted, groupSortedBy, // group props
            sortBy, sortDesc, sort, sortCaseInsensitive, sortGroupBy, sortGroupDesc, sortGroupCaseInsensitive,
            sortDescending, // sort props
            search, searchBy, searchOnEveryWord, searchTerm, searchCaseInsensitive, searchableMinCharactersCount,
            searchMinCharactersCount
        } = props;

        let renderList = convertListToArray(list);

        if (renderList.length === 0) {
            return renderBlank(renderWhenEmpty);
        }

        if (reversed) {
            renderList = reverseList(renderList);
        }

        if (!isNil(limit)) {
            const [from, to] = `${limit}`.split(',');
            renderList = limitList(renderList, from, to);
        }

        if (filterBy) {
            renderList = filterList(renderList, filterBy);
        }

        if (searchTerm || (search && search.term)) {
            const searchOptions = {
                ...defaultProps.search,
                ...search
            };

            renderList = searchList(renderList, {
                by: searchOptions.by
                    || searchBy
                    || '0',
                caseInsensitive: searchOptions.caseInsensitive
                    || searchCaseInsensitive,
                everyWord: searchOptions.onEveryWord
                    || searchOptions.everyWord // deprecated
                    || searchOnEveryWord,
                term: searchOptions.term
                    || searchTerm,
                minCharactersCount: searchOptions.searchableMinCharactersCount // deprecated
                    || searchOptions.minCharactersCount
                    || searchMinCharactersCount
                    || searchableMinCharactersCount // deprecated
                    || 3
            });
        }

        const sortOptions = {
            ...defaultProps.sort,
            ...sort
        };
        if (sortOptions.by || sortBy || (isBoolean(sort) && sort)) {
            renderList = sortList(renderList, {
                caseInsensitive: sortOptions.caseInsensitive
                    || sortCaseInsensitive,
                descending: sortOptions.descending
                    || sortDescending
                    || sortDesc, // deprecated
                by: sortOptions.by
                    || sortBy
            });
        }

        const groupOptions = {
            ...defaultProps.group,
            ...group
        };

        if (groupOptions.by || groupBy || groupOf || groupOptions.of || groupOptions.limit) {
            const groupingOptions = {
                by: groupOptions.by
                    || groupBy,
                limit: groupOptions.of
                    || groupOf
                    || groupOptions.limit, // deprecated
                reversed: groupOptions.reversed
                    || groupReversed
            };

            const gList = groupList(renderList, groupingOptions);

            renderList = gList.groupLists
                .reduce((newGList: any, aGroup, idx: number) => {
                    if (
                        groupSorted || groupOptions.sorted || groupSortedBy || groupOptions.sortedBy
                        || groupOptions.sortBy || sortGroupBy || sortOptions.groupBy // deprecated
                    ) {
                        aGroup = sortList(aGroup, {
                            caseInsensitive: groupSortedCaseInsensitive
                                || groupOptions.sortedCaseInsensitive
                                || groupOptions.sortCaseInsensitive // deprecated
                                || sortGroupCaseInsensitive // deprecated
                                || sortOptions.groupCaseInsensitive, // deprecated
                            descending: groupSortedDescending
                                || groupOptions.sortedDescending
                                || groupOptions.sortDescending // deprecated
                                || sortGroupDesc, // deprecated
                            by: groupSortedBy
                                || groupOptions.sortedBy
                                || groupOptions.sortBy // deprecated
                                || sortGroupBy // deprecated
                        });
                    }

                    const separator = ['___list-separator', gList.groupLabels[idx], aGroup];

                    if (groupOptions.separatorAtTheBottom || groupSeparatorAtTheBottom || showGroupSeparatorAtTheBottom) {
                        return [...newGList, ...aGroup, separator];
                    }

                    return [...newGList, separator, ...aGroup];
                }, []);
        }

        return (
            <List {...props} list={renderList}/>
        );
    };

    return memo(forwardRef((props: any, ref: any) => (
        <DataList {...props} __forwarededRef={ref}/>
    )));
};

export default withList;
