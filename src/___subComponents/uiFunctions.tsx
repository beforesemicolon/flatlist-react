import React from 'react';
import DefaultBlank from './DefaultBlank';
import {isFunction} from '../___utils/isType';

export type renderFunc = (item: any, key: number | string) => JSX.Element | null;

export const renderBlank = (renderWhenEmpty: null | (() => JSX.Element)): JSX.Element => (
    renderWhenEmpty && isFunction(renderWhenEmpty) ? renderWhenEmpty() : DefaultBlank
);

export const handleRenderItem = (renderItem: JSX.Element | renderFunc): renderFunc => (item: any, key: number | string) => {
    if (!renderItem) {
        return null;
    }

    if (isFunction(renderItem)) {
        return (renderItem as (item: any, idx: number | string) => JSX.Element)(item, key);
    }

    const comp = renderItem as JSX.Element;
    return (<comp.type {...comp.props} key={key} item={item} />);
};
