import React, { cloneElement, Component, FC, ReactNode } from "react";
import { isArray, isFunction } from "../___utils/isType";
import DefaultBlank from "./DefaultBlank";

export type renderFunc = (
  item: any,
  key: number | string
) => ReactNode | JSX.Element;

export type renderItem =
  | ReactNode
  | FC<any>
  | Component
  | renderFunc
  | JSX.Element;

export const renderBlank = (
  renderWhenEmpty: ReactNode | (() => JSX.Element) = null
): JSX.Element =>
  renderWhenEmpty && isFunction(renderWhenEmpty)
    ? (renderWhenEmpty as () => JSX.Element)()
    : DefaultBlank();

export const handleRenderGroupSeparator = (CustomSeparator: any) =>
  function (sep: any, idx: number | string): JSX.Element {
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

export const handleRenderItem =
  (
    renderItem: renderItem,
    renderSeparator:
      | null
      | ((s: string, i: number | string) => ReactNode) = null
  ): renderFunc =>
  (item: any, key: number | string) => {
    if (!renderItem) {
      return null;
    }

    const itemId = item.id || key;

    if (isArray(item) && item[0] === "___list-separator") {
      return renderSeparator
        ? (renderSeparator as renderFunc)(item, itemId)
        : null;
    }

    if (isFunction(renderItem)) {
      return (renderItem as renderFunc)(item, itemId);
    }

    const comp = renderItem as JSX.Element;
    return <comp.type {...comp.props} key={itemId} item={item} />;
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
        (scrollContainer.scrollHeight - scrollContainer.offsetHeight).toFixed(0)
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
