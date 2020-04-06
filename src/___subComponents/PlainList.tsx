import React, {forwardRef, Ref, ForwardRefExoticComponent} from 'react';
import convertListToArray from '../___utils/convertListToArray';
import {isFunction} from '../___utils/isType';
import DefaultBlank from './DefaultBlank';

export type renderFunc = (item: any, key: number | string) => JSX.Element;

// this interface is to deal with the fact that ForwardRefExoticComponent does not have the propTypes
export interface ForwardRefExoticComponentExtended extends ForwardRefExoticComponent<Props<{} | []>> {
    propTypes: object;
}

interface Props<T> {
    list: T[];
    renderItem: JSX.Element | renderFunc;
    renderWhenEmpty: null | (() => JSX.Element);
    reversed: boolean;
    wrapperHtmlTag: string;
}

export const handleRenderItem = (renderItem: Props<{} | []>['renderItem']): renderFunc => (item: any, key: number | string) => {
    if (isFunction(renderItem)) {
        return (renderItem as (item: any, idx: number | string) => JSX.Element)(item, key);
    }

    const comp = renderItem as JSX.Element;
    return (<comp.type {...comp.props} key={key} item={item} />);
};

export const renderBlank = (renderWhenEmpty: Props<{} | []>['renderWhenEmpty']): JSX.Element => (
    renderWhenEmpty && isFunction(renderWhenEmpty) ? renderWhenEmpty() : DefaultBlank
);

export default forwardRef((props: Props<{} | []>, ref: Ref<HTMLElement>) => {
    const {list, renderItem, renderWhenEmpty, reversed, wrapperHtmlTag, ...tagProps} = props;
    let renderList = convertListToArray(list);

    if (renderList.length === 0) {
        return renderBlank(renderWhenEmpty);
    }

    const renderThisItem = handleRenderItem(renderItem);

    if (reversed) {
        renderList = renderList.reverse();
    }

    const WrapperElement = `${wrapperHtmlTag}`;
    const content = (
        <>
            {
                renderList.length > 0
                    ? renderList.map(renderThisItem)
                    : renderBlank(renderWhenEmpty)
            }
        </>
    );

    return (
        <>
            {
                WrapperElement
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    ? <WrapperElement ref={ref} {...tagProps}>{content}</WrapperElement>
                    : content
            }
        </>
    );
}) as ForwardRefExoticComponentExtended;
