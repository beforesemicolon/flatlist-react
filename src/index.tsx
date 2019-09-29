import React, {Fragment, PureComponent, createRef} from 'react';
import {array, func, oneOfType, string, bool, node, element, number} from 'prop-types';
import filterList from './utils/filterList';
import sortList from './utils/sortList';
import searchList, {SearchOptionsInterface} from './utils/searchList';
import groupList, {GroupOptionsInterface} from './utils/groupList';
import {isFunction, isArray} from './utils/isType';
import limitList from './utils/limitList';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            groupSeparator: any;
        }
    }
}

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

export default class FlatList extends PureComponent<Props, {}> {
    public static propTypes = {
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

    public static defaultProps = {
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

    public defaultBlank = (<p>List is empty...</p>);

    public childSpanRef = createRef<HTMLSpanElement>();

    public parentComponent: any = null;

    public componentDidMount(): void {
        const {current}: any = this.childSpanRef;

        if (current) {
            this.parentComponent = current.parentNode;

            if (this.parentComponent) {
                const {displayGrid, displayRow} = this.props;

                if (displayGrid) {
                    this.styleParentGrid();
                } else if (displayRow) {
                    this.styleParentRow();
                }
            }
        } else {
            console.warn('FlatList: it was not possible to get container\'s ref. Styling will not be possible');
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.parentComponent) {
            const {displayGrid, displayRow} = this.props;

            if (displayGrid) {
                this.styleParentGrid();
            }

            if (displayRow) {
                this.styleParentRow();
            }
        }
    }

    public componentWillUnmount(): void {
        this.parentComponent = null;
    }

    public styleParentGrid() {
        if (this.props.displayGrid) {
            const {gridGap, minColumnWidth} = this.props;
            this.parentComponent.style.display = 'grid';
            this.parentComponent.style.gridGap = gridGap || '20px';
            this.parentComponent.style.gridTemplateColumns =
                `repeat(auto-fill, minmax(${minColumnWidth || '200px'}, 1fr))`;
            this.parentComponent.style.gridTemplateRows = 'auto';
            this.parentComponent.style.alignItems = 'stretch';
            this.parentComponent
                .querySelectorAll('.___list-separator')
                .forEach((item: HTMLElement) => {
                    item.style.gridColumn = '1 / -1';
                });
        } else {
            this.parentComponent.style.removeProperty('display');
            this.parentComponent.style.removeProperty('grid-gap');
            this.parentComponent.style.removeProperty('grid-template-columns');
            this.parentComponent.style.removeProperty('grid-template-rows');
            this.parentComponent.style.removeProperty('align-items');
            this.parentComponent
                .querySelectorAll('.___list-separator')
                .forEach((item: HTMLElement) => {
                    item.style.removeProperty('grid-column');
                });
        }
    }

    public styleParentRow() {
        if (this.props.displayRow) {
            const {rowGap, showGroupSeparatorAtTheBottom} = this.props;
            this.parentComponent.style.display = 'block';
            [].forEach.call(this.parentComponent.children, (item: HTMLElement) => {
                item.style.display = 'block';
                const nextEl = item.nextElementSibling;

                if (!showGroupSeparatorAtTheBottom || !nextEl || !nextEl.classList.contains('___list-separator')) {
                    item.style.margin = `0 0 ${rowGap || '20px'}`;
                }
            });
        } else {
            this.parentComponent.style.removeProperty('display');
            [].forEach.call(this.parentComponent.children, (item: HTMLElement) => {
                item.style.removeProperty('display');
                item.style.removeProperty('margin');
            });
        }
    }

    public renderGroupedList = (renderList: any[]) => {
        const {
            renderItem, groupBy, sort, sortGroupBy, sortGroupDesc,
            sortCaseInsensitive, groupSeparator, groupOf, showGroupSeparatorAtTheBottom
        } = this.props;

        const groupingOptions: GroupOptionsInterface = {
            by: groupBy,
            limit: groupOf
        };

        const {groupLists, groupLabels} = groupList(renderList, groupingOptions);

        return (groupLists
                .reduce(((groupedList, group, idx: number) => {
                    const separatorKey = `${idx}-${group.length}`;
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
                }), [])
        );
    }

    public render() {
        const {renderWhenEmpty, list} =  this.props;
        const blank = renderWhenEmpty ? renderWhenEmpty() || this.defaultBlank : this.defaultBlank;

        if (list.length === 0) {
           return blank;
        }

        const {
            renderItem, filterBy, groupBy, sortBy, sortDesc, sort, sortCaseInsensitive, groupOf, limit,
            searchBy, searchOnEveryWord, searchTerm, searchCaseInsensitive
        } = this.props;

        let renderList = limitList([...list], limit);

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
                {/* following span is only used here to get the parent of this items since they are wrapped */}
                {/* in fragment which is not rendered on the dom  */}
                {(groupBy || groupOf) ? this.renderGroupedList(renderList) : renderList.map(renderItem)}
                {!this.parentComponent && <span ref={this.childSpanRef} style={{display: 'none'}}/>}
            </Fragment>
        );
    }
}
