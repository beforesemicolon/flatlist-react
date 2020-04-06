import React, {Component, createRef, Fragment} from 'react';
import {bool, string, shape} from 'prop-types';

export interface DisplayInterface {
    row: boolean;
    rowGap: string;
    grid: boolean;
    gridGap: string;
    gridMinColumnWidth: string;
}

export interface DisplayHandlerProps {
    displayRow: boolean;
    rowGap: string;
    displayGrid: boolean;
    showGroupSeparatorAtTheBottom?: boolean;
    gridGap: string;
    minColumnWidth: string;
    display: DisplayInterface;
}

interface State {
    parentComponent: HTMLElement | null;
}

const propTypes = {
    display: shape({
        grid: bool,
        gridGap: string,
        gridMinColumnWidth: string,
        row: bool,
        rowGap: string
    }),
    displayGrid: bool.isRequired,
    displayRow: bool.isRequired,
    gridGap: string.isRequired,
    minColumnWidth: string.isRequired,
    rowGap: string.isRequired,
    showGroupSeparatorAtTheBottom: bool.isRequired
};

const defaultProps = {
    display: {
        grid: false,
        gridGap: '20px',
        gridMinColumnWidth: '200px',
        row: false,
        rowGap: '20px'
    }
};

class DisplayHandler extends Component<DisplayHandlerProps, State> {
    childSpanRef = createRef<HTMLSpanElement>();

    state: State = {
        parentComponent: null
    };

    static propTypes = propTypes;

    static defaultProps = defaultProps;

    componentDidMount(): void {
        const {current}: any = this.childSpanRef;

        if (current) {
            this.setState({parentComponent: current.parentNode}, this.handleDisplayHandlerProps);
        } else {
            console.warn('FlatList: it was not possible to get container\'s ref. Styling will not be possible');
        }
    }

    componentDidUpdate(prevProps: Readonly<DisplayHandlerProps>): void {
        this.handleDisplayHandlerProps();
    }

    handleDisplayHandlerProps(): void {
        const {parentComponent} = this.state;
        if (parentComponent) {
            const {displayGrid, displayRow, display} = this.props;

            if (display.grid || displayGrid) {
                this.styleParentGrid(parentComponent);
            } else if (display.row || displayRow) {
                this.styleParentRow(parentComponent);
            }
        }
    }

    styleParentGrid(parentComponent: HTMLElement): void {
        const {display, displayGrid} = this.props;

        const infiniteLoader = parentComponent.querySelector<HTMLElement>('.__infinite-loader');

        if (displayGrid || display.grid) {
            let {gridGap, minColumnWidth} = this.props;

            gridGap = display.gridGap || gridGap || defaultProps.display.gridGap;
            minColumnWidth = display.gridMinColumnWidth || minColumnWidth || defaultProps.display.gridMinColumnWidth;

            parentComponent.style.display = 'grid';
            parentComponent.style.gridGap = gridGap;
            parentComponent.style.gridTemplateColumns = `repeat(auto-fill, minmax(${minColumnWidth}, 1fr))`;
            parentComponent.style.gridTemplateRows = 'auto';
            parentComponent.style.alignItems = 'stretch';
            parentComponent.querySelectorAll<HTMLElement>('.___list-separator')
                .forEach((item: HTMLElement) => {
                    item.style.gridColumn = '1 / -1';
                });

            if (infiniteLoader) {
                infiniteLoader.style.gridColumn = '1 / -1';
            }
        } else {
            parentComponent.style.removeProperty('display');
            parentComponent.style.removeProperty('grid-gap');
            parentComponent.style.removeProperty('grid-template-columns');
            parentComponent.style.removeProperty('grid-template-rows');
            parentComponent.style.removeProperty('align-items');
            parentComponent.querySelectorAll<HTMLElement>('.___list-separator')
                .forEach((item: HTMLElement) => {
                    item.style.removeProperty('grid-column');
                });

            if (infiniteLoader) {
                infiniteLoader.style.removeProperty('grid-column');
            }
        }
    }

    styleParentRow(parentComponent: HTMLElement): void {
        const {displayRow, display, showGroupSeparatorAtTheBottom} = this.props;

        if (displayRow || display.row) {
            let {rowGap} = this.props;

            rowGap = display.rowGap || rowGap || defaultProps.display.rowGap;

            parentComponent.style.display = 'block';
            [].forEach.call(parentComponent.children, (item: HTMLElement) => {
                if (!item.classList.contains('__infinite-loader')) {
                    item.style.display = 'block';
                    const nextEl = item.nextElementSibling;

                    if (!showGroupSeparatorAtTheBottom || !nextEl || !nextEl.classList.contains('___list-separator')) {
                        item.style.margin = `0 0 ${rowGap}`;
                    }
                }
            });
        } else {
            parentComponent.style.removeProperty('display');
            [].forEach.call(parentComponent.children, (item: HTMLElement) => {
                item.style.removeProperty('display');
                item.style.removeProperty('margin');
            });
        }
    }

    render() {
        const {parentComponent} = this.state;
        return (
            <>
                {/* following span is only used here to get the parent of this items since they are wrapped */}
                {/* in fragment which is not rendered on the dom  */}
                {!parentComponent && <span ref={this.childSpanRef} style={{display: 'none'}} />}
            </>
        );
    }
}

export default DisplayHandler;
