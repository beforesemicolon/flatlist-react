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

interface State {
  parentComponent: HTMLElement | null;
}

class DisplayHandler extends PureComponent<DisplayHandlerProps, State> {
  static propTypes = {
    displayGrid: bool.isRequired,
    displayRow: bool.isRequired,
    gridGap: string.isRequired,
    minColumnWidth: string.isRequired,
    rowGap: string.isRequired,
    showGroupSeparatorAtTheBottom: bool.isRequired,
  };

  childSpanRef = createRef<HTMLSpanElement>();

  state: State = {
    parentComponent: null
  };

  componentDidMount(): void {
    const {current}: any = this.childSpanRef;

    if (current) {
      this.setState({parentComponent: current.parentNode}, this.handleDisplayHandlerProps);
    } else {
      console.warn('FlatList: it was not possible to get container\'s ref. Styling will not be possible');
    }
  }

  componentDidUpdate(prevProps: Readonly<DisplayHandlerProps>) {
    this.handleDisplayHandlerProps();
  }

  handleDisplayHandlerProps() {
    const {parentComponent} = this.state;
    if (parentComponent) {
      const {displayGrid, displayRow} = this.props;

      if (displayGrid) {
        this.styleParentGrid(parentComponent);
      } else if (displayRow) {
        this.styleParentRow(parentComponent);
      }
    }
  }

  styleParentGrid(parentComponent: HTMLElement) {
    if (this.props.displayGrid) {
      const {gridGap, minColumnWidth} = this.props;
      parentComponent.style.display = 'grid';
      parentComponent.style.gridGap = gridGap || '20px';
      parentComponent.style.gridTemplateColumns = `repeat(auto-fill, minmax(${minColumnWidth || '200px'}, 1fr))`;
      parentComponent.style.gridTemplateRows = 'auto';
      parentComponent.style.alignItems = 'stretch';
      parentComponent.querySelectorAll<HTMLElement>('.___list-separator')
          .forEach((item: HTMLElement) => {
            item.style.gridColumn = '1 / -1';
          });
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
    }
  }

  styleParentRow(parentComponent: HTMLElement) {
    if (this.props.displayRow) {
      const {rowGap, showGroupSeparatorAtTheBottom} = this.props;
      parentComponent.style.display = 'block';
      [].forEach.call(parentComponent.children, (item: HTMLElement) => {
        item.style.display = 'block';
        const nextEl = item.nextElementSibling;

        if (!showGroupSeparatorAtTheBottom || !nextEl || !nextEl.classList.contains('___list-separator')) {
          item.style.margin = `0 0 ${rowGap || '20px'}`;
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
        <Fragment>
          {/* following span is only used here to get the parent of this items since they are wrapped */}
          {/* in fragment which is not rendered on the dom  */}
          {!parentComponent && <span ref={this.childSpanRef} style={{display: 'none'}}/>}
        </Fragment>
    );
  }
}

export default DisplayHandler;
