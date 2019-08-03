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
        } else {
            console.warn(
                'FlatList: it was not possible to get containers ref. Styling will not be possible');
        }
    }

    public styleParentGrid = () => {
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

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.parentComponent) {
            const {displayGrid, gridGap, minColumnWidth} = this.props;
            if (
                prevProps.displayGrid !== displayGrid ||
                prevProps.gridGap !== gridGap ||
                prevProps.minColumnWidth !== minColumnWidth
            ) {
                this.styleParentGrid();
            }
            // else if () {
            //     this.styleParentRows();
            // }
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
                onKey: sortBy,
                descending: sortDesc,
                ignoreCasing: ignoreCaseOnWhenSorting
            });
        }

        if (groupBy || groupOf) {
            return (
                <Fragment>
                    <span ref={this.childSpanRef}/>
                    {
                        renderList.length > 0 ?
                            groupList(renderList, {
                                on: isFunction(groupBy) ? groupBy as any : null,
                                by: isString(groupBy) ? groupBy as string : '',
                                every: groupOf || 0
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
                                        onKey: sortGroupBy,
                                        descending: sortGroupDesc,
                                        ignoreCasing: ignoreCaseOnWhenSorting
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
    list: array.isRequired,
    renderItem: func.isRequired,
    renderWhenEmpty: func,
    sortBy: string,
    sortDesc: bool,
    sortGroupDesc: bool,
    sort: bool,
    dontSortOnGroup: bool,
    displayGrid: bool,
    sortGroupBy: string,
    showGroupSeparatorAtTheBottom: bool,
    groupOf: number,
    filterBy: oneOfType([func, string]),
    groupSeparator: oneOfType([node, func, element])
};

FlatList.defaultProps = {
    sortBy: '',
    sortGroupBy: '',
    filterBy: '',
    sortDesc: false,
    displayGrid: false,
    gridGap: '20px',
    minColumnWidth: '200px',
    sortGroupDesc: false,
    showGroupSeparatorAtTheBottom: false,
    groupOf: 0,
    sort: false,
    ignoreCaseOnWhenSorting: false,
    renderWhenEmpty: null,
    groupSeparator: null
};

export default FlatList;
