import React from 'react';
import {isArray, isFunction} from '../___utils/isType';
import DefaultBlank from './DefaultBlank';

export type renderFunc = (item: any, key: number | string) => JSX.Element | null;

export const renderBlank = (renderWhenEmpty: null | (() => JSX.Element)): JSX.Element => (
    renderWhenEmpty && isFunction(renderWhenEmpty) ? renderWhenEmpty() : DefaultBlank
);

export const handleRenderGroupSeparator = (customSeparator: any) => (sep: any, idx: number | string) => {
    const [cls, groupLabel, group] = sep;
    const separatorKey = `separator-${idx}`;
    let separator = (<hr key={separatorKey} className={cls}/>);

    if (customSeparator) {
        if (isFunction(customSeparator)) {
            separator = customSeparator(group, idx, groupLabel);
        } else {
            separator = customSeparator;
        }

        separator = (
            <separator.type
                {...separator.props}
                key={separatorKey}
                className={`${separator.props.className || ''} ${cls}`.trim()}
            />
        );
    }

    return separator;
};

export const handleRenderItem = (
    renderItem: JSX.Element | renderFunc,
    renderSeparator: null | ((s: string, i: number | string) => JSX.Element) = null
): renderFunc => (item: any, key: number | string) => {
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

export const btnPosition = (container: HTMLElement, btn: HTMLElement) => {
    // eslint-disable-next-line no-undef
    const z = window.getComputedStyle(container).zIndex;
    btn.style.position = 'fixed';
    btn.style.zIndex = `${z === 'auto' ? 1 : Number(z) + 1}`;
    btn.style.visibility = 'hidden';

    return (vertical: string, horizontal: string, padding = 0, offset = 50) => {
        const {top, left, width, height}: DOMRect = container.getBoundingClientRect();
        let x = 0;
        let y = 0;

        if (vertical === 'top') {
            y = top + padding;
        } else if (vertical === 'bottom') {
            y = ((top + height) - padding) - btn.offsetHeight;
        }

        if (horizontal === 'left') {
            x = left + padding;
        } else if (horizontal === 'right') {
            x = ((left + width) - padding) - btn.offsetWidth;
        }

        // eslint-disable-next-line no-undef
        window.requestAnimationFrame(() => {
            const dist = Number((container.scrollHeight - container.offsetHeight).toFixed(0));
            offset = Math.min(offset, dist);

            btn.style.top = `${y}px`;
            btn.style.left = `${x}px`;
            btn.style.visibility = (Number(container.scrollTop.toFixed(0)) >= offset) ? 'visible' : 'hidden';
        });
    };
};
