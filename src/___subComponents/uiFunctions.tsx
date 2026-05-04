import React, { cloneElement, Component, FC, ReactNode } from "react";
import { isArray, isFunction } from "../___utils/isType";
import DefaultBlank from "./DefaultBlank";

export type renderFunc<ListItem> = (
  item: ListItem,
  key: string,
) => ReactNode | React.JSX.Element;

export type renderItem<ListItem> =
  | ReactNode
  | FC<any>
  | Component
  | renderFunc<ListItem>
  | React.JSX.Element;

export const renderBlank = (
  renderWhenEmpty: ReactNode | (() => React.JSX.Element) = null,
): React.JSX.Element =>
  renderWhenEmpty && isFunction(renderWhenEmpty)
    ? (renderWhenEmpty as () => React.JSX.Element)()
    : DefaultBlank();

export const handleRenderGroupSeparator = (CustomSeparator: any) => {
  const GroupSeparator = (
    sep: any,
    idx: number | string,
  ): React.JSX.Element => {
    const [cls, groupLabel, group] = sep;
    const separatorKey = `separator-${idx}`;

    if (CustomSeparator) {
      if (isFunction(CustomSeparator)) {
        const Sep = CustomSeparator(group, idx, groupLabel);
        return (
          <div key={separatorKey} className={cls}>
            <Sep.type {...Sep.props} />
          </div>
        );
      }

      return (
        <div key={separatorKey} className={cls}>
          {cloneElement(CustomSeparator, { groupLabel, group })}
        </div>
      );
    }

    return <hr key={separatorKey} className={cls} />;
  };
  return GroupSeparator;
};

export const handleRenderGroupHeader = (CustomHeader: any) => {
  const GroupHeader = (
    header: any,
    idx: number | string,
  ): React.JSX.Element | null => {
    const [cls, groupLabel, group] = header;
    const headerKey = `header-${idx}`;

    if (CustomHeader) {
      if (isFunction(CustomHeader)) {
        return (
          <div key={headerKey} className={cls}>
            {CustomHeader(groupLabel, group)}
          </div>
        );
      }

      return (
        <div key={headerKey} className={cls}>
          {cloneElement(CustomHeader, { groupLabel, group })}
        </div>
      );
    }

    return null;
  };
  return GroupHeader;
};

export const handleRenderGroupFooter = (CustomFooter: any) => {
  const GroupFooter = (
    footer: any,
    idx: number | string,
  ): React.JSX.Element | null => {
    const [cls, groupLabel, group] = footer;
    const footerKey = `footer-${idx}`;

    if (CustomFooter) {
      if (isFunction(CustomFooter)) {
        return (
          <div key={footerKey} className={cls}>
            {CustomFooter(groupLabel, group)}
          </div>
        );
      }

      return (
        <div key={footerKey} className={cls}>
          {cloneElement(CustomFooter, { groupLabel, group })}
        </div>
      );
    }

    return null;
  };
  return GroupFooter;
};

export const handleRenderItem = <ListItem,>(
  renderItem: renderFunc<ListItem>,
  renderSeparator:
    | null
    | ((s: ListItem, i: number | string) => ReactNode) = null,
  renderHeader: null | ((s: ListItem, i: number | string) => ReactNode) = null,
  renderFooter: null | ((s: ListItem, i: number | string) => ReactNode) = null,
) => {
  const ItemRenderer = (item: ListItem, key: number | string) => {
    if (!renderItem) {
      return null;
    }

    const itemId =
      (`${item}` === "[object Object]" &&
        (item as { id: string | number }).id) ||
      key;

    if (isArray(item)) {
      const type = (item as ListItem[])[0];
      if (type === "___list-separator") {
        return typeof renderSeparator === "function"
          ? renderSeparator(item, itemId)
          : null;
      }
      if (type === "___list-group-header") {
        return typeof renderHeader === "function"
          ? renderHeader(item, itemId)
          : null;
      }
      if (type === "___list-group-footer") {
        return typeof renderFooter === "function"
          ? renderFooter(item, itemId)
          : null;
      }
    }

    if (typeof renderItem === "function") {
      return renderItem(item, `${itemId}`);
    }

    const comp = renderItem as React.JSX.Element;

    return <comp.type {...comp.props} key={itemId} item={item} />;
  };
  return ItemRenderer;
};

export const btnPosition = (scrollContainer: HTMLElement, btn: HTMLElement) => {
  const z = window.getComputedStyle(scrollContainer).zIndex;
  btn.style.position = "absolute";
  btn.style.zIndex = `${z === "auto" ? 1 : Number(z) + 1}`;
  btn.style.visibility = "hidden";

  return (vertical: string, horizontal: string, padding = 20, offset = 50) => {
    let x = "0px";
    let y = "0px";

    if (vertical === "top") {
      y = `${parseFloat(`${padding}`)}px`;
    } else if (vertical === "bottom") {
      y = `calc(100% - ${parseFloat(`${padding}`) + btn.offsetHeight}px)`;
    }

    if (horizontal === "left") {
      x = `${parseFloat(`${padding}`)}px`;
    } else if (horizontal === "right") {
      x = `calc(100% - ${parseFloat(`${padding}`) + btn.offsetWidth}px)`;
    }

    window.requestAnimationFrame(() => {
      const dist = Number(
        (scrollContainer.scrollHeight - scrollContainer.offsetHeight).toFixed(
          0,
        ),
      );
      offset = Math.min(offset, dist);

      btn.style.top = y;
      btn.style.left = x;
      btn.style.visibility =
        dist !== 0 && // got scrolled
        Number(scrollContainer.scrollTop.toFixed(0)) >= offset // position meets the offset
          ? "visible"
          : "hidden";
    });
  };
};
