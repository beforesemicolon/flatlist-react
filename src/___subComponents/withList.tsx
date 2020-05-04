import React, {forwardRef, memo} from 'react';
import convertListToArray from '../___utils/convertListToArray';
import filterList from '../___utils/filterList';
import groupList from '../___utils/groupList';
import {isBoolean} from '../___utils/isType';
import limitList from '../___utils/limitList';
import searchList from '../___utils/searchList';
import sortList from '../___utils/sortList';
import {renderBlank} from './uiFunctions';

const withList = (List: any) => {
    const defaultGroupoptions = {
        by: '',
        limit: 0,
        reversed: false,
        separator: null,
        separatorAtTheBottom: false,
        sortBy: '',
        sortCaseInsensitive: false,
        sortDescending: false
    };

    const defaultSearchOptions = {
        by: '',
        caseInsensitive: false,
        everyWord: false,
        searchableMinCharactersCount: 0,
        term: ''
    };

    const defaultSort = {
        caseInsensitive: false,
        descending: false,
        by: '',
        groupBy: '',
        groupCaseInsensitive: false,
        groupDescending: false
    };

    const DataList = (props: any) => {
        const {
            list, limit, reversed, renderWhenEmpty, // render/list related props
            filterBy, // filter props
            group, groupBy, groupOf, showGroupSeparatorAtTheBottom, groupReversed, // group props
            sortBy, sortDesc, sort, sortCaseInsensitive, sortGroupBy, sortGroupDesc, // sort props
            search, searchBy, searchOnEveryWord, searchTerm, searchCaseInsensitive, searchableMinCharactersCount
        } = props;
        let renderList = convertListToArray(list);

        if (renderList.length === 0) {
            return renderBlank(renderWhenEmpty);
        }

        if (reversed) {
            renderList = renderList.reverse();
        }

        if (limit !== null) {
            renderList = limitList(renderList, limit);
        }

        if (filterBy) {
            renderList = filterList(renderList, filterBy);
        }

        if (searchTerm || (search && search.term)) {
            const searchWithDefaults = {
                ...defaultSearchOptions,
                ...search
            };

            renderList = searchList(renderList, {
                by: searchWithDefaults.by || searchBy || '0',
                caseInsensitive: searchWithDefaults.caseInsensitive || searchCaseInsensitive,
                everyWord: searchWithDefaults.everyWord || searchOnEveryWord,
                term: searchWithDefaults.term || searchTerm,
                minCharactersCount: searchWithDefaults.searchableMinCharactersCount || searchableMinCharactersCount || 3
            });
        }

        const sortOptions = {
            ...defaultSort,
            ...sort
        };
        if (sortOptions.by || sortBy || (isBoolean(sort) && sort)) {
            renderList = sortList(renderList, {
                caseInsensitive: sortOptions.caseInsensitive || sortCaseInsensitive,
                descending: sortOptions.descending || sortDesc,
                by: sortOptions.by || sortBy
            });
        }

        const groupOptions = {
            ...defaultGroupoptions,
            ...group
        };
        if (groupOptions.by || groupOptions.limit || groupBy || groupOf) {
            const groupingOptions = {
                by: groupOptions.by || groupBy,
                limit: groupOptions.limit || groupOf,
                reversed: groupOptions.reversed || groupReversed
            };

            const gList = groupList(renderList, groupingOptions);

            renderList = gList.groupLists
                .reduce((newGList: any, aGroup, idx: number) => {
                    if (groupOptions.sortBy || sortGroupBy || sortOptions.groupBy) {
                        aGroup = sortList(aGroup, {
                            caseInsensitive: groupOptions.sortCaseInsensitive
                                || sortCaseInsensitive || sortOptions.groupCaseInsensitive,
                            descending: groupOptions.sortDescending
                                || sortGroupDesc || sortOptions.groupDescending,
                            by: groupOptions.sortBy || sortGroupBy || sortOptions.groupBy
                        });
                    }
                    const separator = ['___list-separator', gList.groupLabels[idx], aGroup];

                    if (groupOptions.separatorAtTheBottom || showGroupSeparatorAtTheBottom) {
                        return [...newGList, ...aGroup, separator];
                    }

                    return [...newGList, separator, ...aGroup];
                }, []);
        }

        console.log('-- renderList', renderList);

        return <List {...props} list={renderList}/>;
    };

    return memo(forwardRef((props: any, ref: any) => (
        <DataList {...props} __forwarededRef={ref}/>
    )));
};

export default withList;
