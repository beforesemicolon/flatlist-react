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
    separatorGap?: string;
    displayGrid?: boolean;
    gridGap?: string;
    minColumnWidth?: string;
    groupSeparator?: null | any;
    dontSortOnGroup?: boolean;
    ignoreCaseOnWhenSorting?: boolean;
    renderItem: (item: any, idx: number) => any;
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
            current.remove();

            if (this.props.displayGrid) {
                this.styleParentGrid();
            }

            if (this.props.displayRow) {
                this.styleParentRow();
            }
        } else {
            console.warn(
                'FlatList: it was not possible to get containers ref. Styling will not be possible');
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
            const {rowGap, separatorGap, showGroupSeparatorAtTheBottom} = this.props;
            this.parentComponent.style.display = 'block';
            [].forEach.call(this.parentComponent.children, (item: HTMLElement) => {
                item.style.display = 'block';

                if (item.classList.contains('___list-separator')) {
                    const separatorGapDef = separatorGap || '10px';
                    if (showGroupSeparatorAtTheBottom) {
                        item.style.margin = `${separatorGapDef} 0 0`;
                    } else {
                        item.style.margin = `0 0 ${separatorGapDef}`;
                    }
                } else {
                    const nextEl = item.nextElementSibling;

                    if (!showGroupSeparatorAtTheBottom || !nextEl || !nextEl.classList.contains('___list-separator')) {
                        item.style.margin = `0 0 ${rowGap || '20px'}`;
                    }
                }
            });
        } else {
            // none
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.parentComponent) {
            const {displayGrid, gridGap, minColumnWidth, displayRow, rowGap, separatorGap} = this.props;

            if (
                prevProps.displayGrid !== displayGrid ||
                prevProps.gridGap !== gridGap ||
                prevProps.minColumnWidth !== minColumnWidth
            ) {
                this.styleParentGrid();
            }

            if (
                prevProps.displayRow !== displayRow ||
                prevProps.rowGap !== rowGap ||
                prevProps.separatorGap !== separatorGap
            ) {
                this.styleParentRow();
            }
        }
    }

    public render() {
        const {
            list, renderItem, filterBy, groupBy, renderWhenEmpty, sortBy, sortDesc, sort, sortGroupBy, sortGroupDesc,
            ignoreCaseOnWhenSorting, groupSeparator, groupOf, showGroupSeparatorAtTheBottom
        } = this.props;

        let renderList = list;

        const blank = renderWhenEmpty ? renderWhenEmpty() || this.defaultBlank : this.defaultBlank;

        if (filterBy) {
            renderList = filterList(renderList, filterBy);
        }

        if (sort || sortBy) {
            renderList = sortList(renderList, {
                descending: sortDesc,
                ignoreCasing: ignoreCaseOnWhenSorting,
                onKey: sortBy
            });
        }

        if (groupBy || groupOf) {
            return (
                <Fragment>
                    <span ref={this.childSpanRef}/>
                    {
                        renderList.length > 0 ?
                            groupList(renderList, {
                                by: isString(groupBy) ? groupBy as string : '',
                                every: groupOf || 0,
                                on: isFunction(groupBy) ? groupBy as any : null
                            }).reduce(((groupedList, group, idx) => {
                                const separatorKey = `${idx}-${group.length}`;
                                let separator = (<hr key={separatorKey} className='___list-separator'/>);

                                if (groupSeparator) {
                                    separator = isFunction(groupSeparator) ?
                                        groupSeparator(group, idx) : groupSeparator;

                                    separator = (
                                        <separator.type {...separator.props} key={separatorKey}
                                                        className={`${separator.props.className} ___list-separator`}/>);
                                }

                                if (sort || sortGroupBy) {
                                    group = sortList(group, {
                                        descending: sortGroupDesc,
                                        ignoreCasing: ignoreCaseOnWhenSorting,
                                        onKey: sortGroupBy
                                    });
                                }

                                if (showGroupSeparatorAtTheBottom) {
                                    return groupedList.concat(...group.map(renderItem), separator);
                                }

                                return groupedList.concat(separator, ...group.map(renderItem));
                            }), []) :
                            blank
                    }
                </Fragment>
            );
        }

        return (
            <Fragment>
                <span ref={this.childSpanRef}/>
                {
                    renderList.length > 0 ?
                        renderList.map((item, idx) => renderItem(item, idx)) :
                        blank
                }
            </Fragment>
        );
    }
}

FlatList.propTypes = {
    displayGrid: bool,
    displayRow: bool,
    filterBy: oneOfType([func, string]),
    gridGap: string,
    groupOf: number,
    groupSeparator: oneOfType([node, func, element]),
    list: array.isRequired,
    minColumnWidth: string,
    renderItem: func.isRequired,
    renderWhenEmpty: func,
    rowGap: string,
    separatorGap: string,
    showGroupSeparatorAtTheBottom: bool,
    sort: bool,
    sortBy: string,
    sortDesc: bool,
    sortGroupBy: string,
    sortGroupDesc: bool
};

FlatList.defaultProps = {
    displayGrid: false,
    displayRow: false,
    filterBy: '',
    gridGap: '20px',
    groupOf: 0,
    groupSeparator: null,
    ignoreCaseOnWhenSorting: false,
    minColumnWidth: '200px',
    renderWhenEmpty: null,
    rowGap: '20px',
    separatorGap: '10px',
    showGroupSeparatorAtTheBottom: false,
    sort: false,
    sortBy: '',
    sortDesc: false,
    sortGroupBy: '',
    sortGroupDesc: false,
};

export default FlatList;
