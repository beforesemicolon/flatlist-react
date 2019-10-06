import {bool, string} from 'prop-types';
import React, {PureComponent, createRef, Fragment} from 'react';

export interface DisplayHandlerProps {
  displayRow: boolean;
  rowGap: string;
  displayGrid: boolean;
  showGroupSeparatorAtTheBottom?: boolean;
  gridGap: string;
  minColumnWidth: string;
}

class DisplayHandler extends PureComponent<DisplayHandlerProps, {}> {
  public static propTypes = {
    displayGrid: bool.isRequired,
    displayRow: bool.isRequired,
    gridGap: string.isRequired,
    minColumnWidth: string.isRequired,
    rowGap: string.isRequired,
    showGroupSeparatorAtTheBottom: bool.isRequired,
  };

  public childSpanRef = createRef<HTMLSpanElement>();

  public parentComponent: any = null;

  public componentDidMount(): void {
    const {current}: any = this.childSpanRef;

    if (current) {
      this.parentComponent = current.parentNode;
      this.handleDisplayHandlerProps();
    } else {
      console.warn('FlatList: it was not possible to get container\'s ref. Styling will not be possible');
    }
  }

  public componentDidUpdate(prevProps: Readonly<DisplayHandlerProps>) {
    this.handleDisplayHandlerProps();
  }

  public componentWillUnmount(): void {
    this.parentComponent = null;
  }

  public handleDisplayHandlerProps() {
    if (this.parentComponent) {
      const {displayGrid, displayRow} = this.props;

      if (displayGrid) {
        this.styleParentGrid();
      } else if (displayRow) {
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

  public render() {
    return (
        <Fragment>
          {/* following span is only used here to get the parent of this items since they are wrapped */}
          {/* in fragment which is not rendered on the dom  */}
          {!this.parentComponent && <span ref={this.childSpanRef} style={{display: 'none'}}/>}
        </Fragment>
    );
  }
}

export default DisplayHandler;
