import React, { createRef, useEffect, useState } from "react";

export interface DisplayInterface {
  row?: boolean;
  rowGap?: string;
  grid?: boolean;
  gridGap?: string;
  gridMinColumnWidth?: string;
}

export interface DisplayHandlerProps {
  displayRow?: boolean;
  rowGap?: string;
  displayGrid?: boolean;
  // showGroupSeparatorAtTheBottom?: boolean;
  gridGap?: string;
  minColumnWidth?: string;
  display?: DisplayInterface;
}

const defaultProps: Required<DisplayHandlerProps> = {
  display: {
    grid: false,
    gridGap: "20px",
    gridMinColumnWidth: "200px",
    row: false,
    rowGap: "20px",
  },
  displayGrid: false,
  displayRow: false,
  gridGap: "20px",
  minColumnWidth: "200px",
  rowGap: "20px",
};

function DisplayHandler(props: DisplayHandlerProps) {
  const { displayGrid, displayRow, display, gridGap, minColumnWidth, rowGap } =
    { ...defaultProps, ...props };
  const childSpanRef = createRef<HTMLSpanElement>();
  const [combo, setParentComponent] = useState<[HTMLElement, HTMLElement]>();

  const styleParentGrid = (
    styleTag: HTMLElement,
    container: HTMLElement
  ): void => {
    if (displayGrid || display.grid) {
      const gap = display.gridGap || gridGap || defaultProps.display.gridGap;
      const column =
        display.gridMinColumnWidth ||
        minColumnWidth ||
        defaultProps.display.gridMinColumnWidth;

      styleTag.innerHTML = `
          [data-cont="${container.dataset.cont}"] {
              display: grid;
              grid-gap: ${gap};
              gap: ${gap};
              grid-template-columns: repeat(auto-fill, minmax(${column}, 1fr));
              grid-template-rows: auto;
              align-items: stretch;
          }
          
          [data-cont="${container.dataset.cont}"] .__infinite-loader,
          [data-cont="${container.dataset.cont}"] .___scroll-renderer-anchor,
          [data-cont="${container.dataset.cont}"] .___list-separator {
              grid-column: 1/-1;
          }
      `;
    } else {
      styleTag.innerHTML = "";
    }
  };

  const styleParentRow = (
    styleTag: HTMLElement,
    container: HTMLElement
  ): void => {
    if (displayRow || display.row) {
      const gap = display.rowGap || rowGap || defaultProps.display.rowGap;

      styleTag.innerHTML = `
          [data-cont="${container.dataset.cont}"] {
              display: flex;
              flex-direction: column;
          }
          
          [data-cont="${container.dataset.cont}"] > *:not(.__infinite-loader) {
              display: block;
              flex: 1;
              width: 100%;
              margin-bottom: ${gap};
          }
      `;
    } else {
      styleTag.innerHTML = "";
    }
  };

  const handleDisplayHandlerProps = (
    container: HTMLElement,
    style: HTMLElement
  ): void => {
    if (container) {
      if (display.grid || displayGrid) {
        styleParentGrid(style, container);
      } else if (display.row || displayRow) {
        styleParentRow(style, container);
      }
    }
  };

  useEffect(() => {
    if (combo) {
      handleDisplayHandlerProps(combo[0], combo[1]);
    }
  });

  useEffect(() => {
    const { current } = childSpanRef;
    let container: HTMLElement;
    let style: HTMLElement;

    if (current) {
      const id = `__container-${new Date().getTime()}`;
      container = current.parentNode as HTMLElement;

      if (container) {
        container.setAttribute("data-cont", id);
        style = document.createElement("STYLE");
        style.id = id;
        document.head.appendChild(style);
        setParentComponent([container, style]);
        handleDisplayHandlerProps(container, style);
      }
    } else {
      console.warn(
        "FlatList: it was not possible to get container's ref. Styling will not be possible"
      );
    }

    return () => {
      if (style) {
        style.remove();
      }
    };
  }, []);

  return (
    <>
      {/* following span is only used here to get the parent of these items since they are wrapped */}
      {/* in fragment which is not rendered on the dom  */}
      {!combo && <span ref={childSpanRef} style={{ display: "none" }} />}
    </>
  );
}

export default DisplayHandler;
