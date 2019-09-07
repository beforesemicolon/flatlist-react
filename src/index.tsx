import React, {Fragment, Component, createRef} from 'react';
import {array, func, oneOfType, string, bool, node, element, number} from 'prop-types';
import filterList from './utils/filterList';
import sortList from './utils/sortList';
import groupList from './utils/groupList';
import {isString, isFunction} from './utils/isType';

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
    sort?: boolean;
    displayRow?: boolean;
    rowGap?: string;
    displayGrid?: boolean;
    gridGap?: string;
    minColumnWidth?: string;
    groupSeparator?: null | any;
    dontSortOnGroup?: boolean;
    ignoreCaseOnWhenSorting?: boolean;
    renderItem: (item: any, idx: number | string) => any;
    renderWhenEmpty?: null | (() => any);
    filterBy?: string | ((item: any, idx: number) => boolean);
    groupBy?: string | ((item: any, idx: number) => boolean);
    groupOf?: number;
}

class FlatList extends Component<Props, {}> {
    public static propTypes = {};

    public static defaultProps = {};

    public defaultBlank = (<p>List is empty...</p>);

    public childSpanRef = createRef<HTMLSpanElement>();

    public parentComponent: any = null;

    public componentDidMount(): void {
        const {current}: any = this.childSpanRef;
        if (current) {
            this.parentComponent = current.parentNode;
            current.remove(); // remove the span from the dom

            if (this.props.displayGrid) {
                this.styleParentGrid();
            }

            if (this.props.displayRow) {
                this.styleParentRow();
            }
        } else {
            console.warn(
                'FlatList: it was not possible to get container\'s ref. Styling will not be possible');
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.parentComponent) {
            const {displayGrid, gridGap, minColumnWidth, displayRow, rowGap} = this.props;

            if (
                prevProps.displayGrid !== displayGrid ||
                prevProps.gridGap !== gridGap ||
                prevProps.minColumnWidth !== minColumnWidth
            ) {
                this.styleParentGrid();
            }

            if (
                prevProps.displayRow !== displayRow ||
                prevProps.rowGap !== rowGap
            ) {
                this.styleParentRow();
            }
        }
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
            ignoreCaseOnWhenSorting, groupSeparator, groupOf, showGroupSeparatorAtTheBottom
        } = this.props;

        return (
            groupList(renderList, {
                by: isString(groupBy) ? groupBy as string : '',
                every: groupOf || 0,
                on: isFunction(groupBy) ? groupBy as any : null
            }).reduce(((groupedList, group, idx: number) => {
                const separatorKey = `${idx}-${group.length}`;
                let separator = (<hr key={separatorKey} className='___list-separator'/>);

                if (groupSeparator) {
                    separator = isFunction(groupSeparator) ?
                        groupSeparator(group, idx) : groupSeparator;

                    separator = (
                        <separator.type
                            {...separator.props}
                            key={separatorKey}
                            className={`___list-separator ${separator.props.className || ''}`}
                        />
                    );
                }

                if (sort || sortGroupBy) {
                    group = sortList(group, {
                        descending: sortGroupDesc,
                        ignoreCasing: ignoreCaseOnWhenSorting,
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
        const {
            list, renderItem, filterBy, groupBy, renderWhenEmpty, sortBy,
            sortDesc, sort, ignoreCaseOnWhenSorting, groupOf
        } = this.props;

        let renderList = list;

        const blank = renderWhenEmpty ? renderWhenEmpty() || this.defaultBlank : this.defaultBlank;

        if (filterBy) {
            renderList = filterList(list, filterBy);
        }

        if (sort || sortBy) {
            renderList = sortList(renderList, {
                descending: sortDesc,
                ignoreCasing: ignoreCaseOnWhenSorting,
                onKey: sortBy
            });
        }

        return (
            <Fragment>
                {/* following span is only used here to get the parent of this items since they are wrapped */}
                {/* in fragment which is not rendered on the dom  */}
                <span ref={this.childSpanRef}/>
                {/* tslint:disable-next-line:jsx-no-multiline-js */}
                {renderList.length > 0 ?
                    (groupBy || groupOf) ? this.renderGroupedList(renderList) : renderList.map(renderItem) : blank
                }
            </Fragment>
        );
    }
}

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
    ignoreCaseOnWhenSorting: false,
    minColumnWidth: '200px',
    renderWhenEmpty: null,
    rowGap: '20px',
    showGroupSeparatorAtTheBottom: false,
    sort: false,
    sortBy: '',
    sortDesc: false,
    sortGroupBy: '',
    sortGroupDesc: false,
};

export default FlatList;
