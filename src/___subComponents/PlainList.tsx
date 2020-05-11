import {array, bool, func, node, object, oneOfType, string} from 'prop-types';
import React, {forwardRef, Ref} from 'react';
import convertListToArray from '../___utils/convertListToArray';
import {isString} from '../___utils/isType';
import DefaultBlank from './DefaultBlank';
import ScrollRenderer from './ScrollRenderer';
import {handleRenderItem, renderBlank, renderFunc} from './uiFunctions';

interface Props {
    list: any[];
    renderItem: JSX.Element | renderFunc;
    renderWhenEmpty?: null | (() => JSX.Element);
    wrapperHtmlTag?: string;
    renderScroll?: boolean;
    __forwarededRef?: Ref<HTMLElement>;
    [key: string]: any;
}

const PlainList = (props: Props) => {
    const {
        list, renderItem, renderWhenEmpty, renderScroll, wrapperHtmlTag, __forwarededRef,
        ...tagProps
    } = props;
    const dataList = convertListToArray(list);

    if (dataList.length === 0) {
        return renderBlank(renderWhenEmpty);
    }

    const WrapperElement = `${isString(wrapperHtmlTag) && wrapperHtmlTag ? wrapperHtmlTag : ''}`;
    const content = (
        <>
            {
                renderScroll
                    ? <ScrollRenderer list={dataList} renderItem={renderItem}/>
                    : dataList.map(handleRenderItem(renderItem))
            }
        </>
    );

    return (
        <>
            {
                WrapperElement
                    // @ts-ignore
                    ? <WrapperElement {...tagProps} ref={__forwarededRef}>{content}</WrapperElement>
                    : content
            }
        </>
    );
};

PlainList.propTypes = {
    /**
     * a list of anything to be displayed
     */
    list: oneOfType([array, object]).isRequired,
    /**
     * a jsx element or a function that it is called for every item on the list and returns a jsx element
     */
    renderItem: oneOfType([func, node]).isRequired,
    /**
     * the function that gets called when the list is empty or was filtered to the point it became empty
     */
    renderWhenEmpty: func,
    /**
     * a optional html tag to use to wrap the list items
     */
    wrapperHtmlTag: string,
    // eslint-disable-next-line react/forbid-prop-types
    __forwarededRef: object,
    renderScroll: bool
};

PlainList.defaultProps = {
    wrapperHtmlTag: '',
    renderWhenEmpty: DefaultBlank,
    renderScroll: false,
    __forwarededRef: {current: null}
};

export default forwardRef((props: Props, ref: Ref<HTMLElement>) => (
    <PlainList __forwarededRef={ref} {...props} />
));
