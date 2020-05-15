import React, {cloneElement} from 'react';
import {isArray, isFunction} from '../___utils/isType';
import DefaultBlank from './DefaultBlank';

export type renderFunc = (item: any, key: number | string) => JSX.Element | null;

export const renderBlank = (renderWhenEmpty: null | (() => JSX.Element) = null): JSX.Element => (
    renderWhenEmpty && isFunction(renderWhenEmpty) ? renderWhenEmpty() : DefaultBlank()
);

export const handleRenderGroupSeparator = (CustomSeparator: any) => (sep: any, idx: number | string): JSX.Element => {
    const [cls, groupLabel, group] = sep;
    const separatorKey = `separator-${idx}`;

    if (CustomSeparator) {
        if (isFunction(CustomSeparator)) {
            const Sep = CustomSeparator(group, idx, groupLabel);
            return (
                <div key={separatorKey} className={cls}>
                    <Sep.type {...Sep.props}/>
                </div>
            );
        }

        return (
            <div key={separatorKey} className={cls}>
                {cloneElement(CustomSeparator, {groupLabel, group})}
            </div>
        );
    }

    return (
        <hr key={separatorKey} className={cls}/>
    );
};

export const handleRenderItem = (
    renderItem: JSX.Element | renderFunc | null,
    renderSeparator: null | ((s: string, i: number | string) => JSX.Element) = null
): renderFunc => (item: any, key: number | string): JSX.Element | null => {
    if (!renderItem) {
        return null;
    }

    if (isArray(item) && item[0] === '___list-separator') {
        return renderSeparator
            ? (renderSeparator as (s: string, i: number | string) => JSX.Element)(item, key)
            : null;
    }

    if (isFunction(renderItem)) {
        return (renderItem as (item: any, idx: number | string) => JSX.Element)(item, key);
    }

    const comp = renderItem as JSX.Element;
    return (<comp.type {...comp.props} key={key} item={item}/>);
};

export const btnPosition = (scrollContainer: HTMLElement, btn: HTMLElement) => {
    const z = window.getComputedStyle(scrollContainer).zIndex;
    btn.style.position = 'absolute';
    btn.style.zIndex = `${z === 'auto' ? 1 : Number(z) + 1}`;
    btn.style.visibility = 'hidden';

    return (vertical: string, horizontal: string, padding = 20, offset = 50) => {
        let x = '0px';
        let y = '0px';

        if (vertical === 'top') {
            y = `${parseFloat(`${padding}`)}px`;
        } else if (vertical === 'bottom') {
            y = `calc(100% - ${parseFloat(`${padding}`) + btn.offsetHeight}px)`;
        }

        if (horizontal === 'left') {
            x = `${parseFloat(`${padding}`)}px`;
        } else if (horizontal === 'right') {
            x = `calc(100% - ${parseFloat(`${padding}`) + btn.offsetWidth}px)`;
        }

        window.requestAnimationFrame(() => {
            const dist = Number((scrollContainer.scrollHeight - scrollContainer.offsetHeight).toFixed(0));
            offset = Math.min(offset, dist);

            btn.style.top = y;
            btn.style.left = x;
            btn.style.visibility = (Number(scrollContainer.scrollTop.toFixed(0)) >= offset) ? 'visible' : 'hidden';
        });
    };
};
