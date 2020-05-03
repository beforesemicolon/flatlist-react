import {any, arrayOf, func} from 'prop-types';
import React from 'react';
import {handleRenderItem, renderBlank, renderFunc} from './uiFunctions';

interface Props {
    renderList: any[];
    renderItem: JSX.Element | renderFunc;
    renderWhenEmpty: null | (() => JSX.Element);
}

const DefaultRenderer = (props: Props) => {
    const {renderList, renderItem, renderWhenEmpty} = props;

    const renderThisItem = handleRenderItem(renderItem);

    return (
        <>
            {
                renderList.length > 0
                    ? renderList.map(renderThisItem)
                    : renderBlank(renderWhenEmpty)
            }
        </>
    );
};

DefaultRenderer.propTypes = {
    renderList: arrayOf(any).isRequired,
    renderItem: func.isRequired,
    renderWhenEmpty: func.isRequired
};

export default DefaultRenderer;
