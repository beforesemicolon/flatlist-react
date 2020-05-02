import {array, func, node, object, oneOfType, string} from 'prop-types';
import React, {forwardRef, memo, Ref} from 'react';
import arePropsEqual from '../___utils/arePropsEqual';
import convertListToArray from '../___utils/convertListToArray';
import {isString} from '../___utils/isType';
import DefaultBlank from './DefaultBlank';
import {DisplayHandlerProps} from './DisplayHandler';
import {handleRenderItem, renderBlank, renderFunc} from './uiFunctions';

interface Props<T> extends DisplayHandlerProps {
    list: T[];
    renderItem: JSX.Element | renderFunc;
    renderWhenEmpty: null | (() => JSX.Element);
    wrapperHtmlTag: string;
    __forwarededRef: object;
}

// const List = PlainList() as ForwardRefExoticComponentExtended;

const PlainList = (props: Props<DisplayHandlerProps | []>) => {
    const {
        list, renderItem, renderWhenEmpty, wrapperHtmlTag, __forwarededRef,
        ...tagProps
    } = props;
    const renderList = convertListToArray(list);

    if (renderList.length === 0) {
        return renderBlank(renderWhenEmpty);
    }

    const renderThisItem = handleRenderItem(renderItem);

    const WrapperElement = `${isString(wrapperHtmlTag) && wrapperHtmlTag ? wrapperHtmlTag : ''}`;
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
    __forwarededRef: object
};

PlainList.defaultProps = {
    wrapperHtmlTag: '',
    renderWhenEmpty: DefaultBlank,
    __forwarededRef: {}
};

export default memo(forwardRef((props: Props<DisplayHandlerProps | []>, ref: Ref<HTMLElement>) => (
    <PlainList __forwarededRef={ref} {...props} />
)), arePropsEqual);
