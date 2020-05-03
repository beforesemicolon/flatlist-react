import {any, arrayOf, func} from 'prop-types';
import React, {createRef, useEffect, useLayoutEffect, useState} from 'react';
import convertListToArray from '../___utils/convertListToArray';
import {handleRenderItem, renderFunc} from './uiFunctions';

interface Props {
    list: any[];
    renderItem: JSX.Element | renderFunc;
}

const ScrollRenderer = (props: Props) => {
    const [renderList, setRenderList] = useState([]);
    const [index, setIndex] = useState(0);
    const {list, renderItem} = props;
    const dataList = convertListToArray(list);
    const containerRef: any = createRef();
    let adding = false;

    const addItem = () => {
        if (!adding && index < dataList.length) {
            adding = true;
            setRenderList([...renderList, dataList[index]] as any);
            setIndex(index + 1);
        }
    };

    useEffect(() => {
        const span: any = containerRef.current;
        const container = span.parentNode;

        return () => { // when unmounted
            container.removeEventListener('scroll', addItem, true);
        };
    }, []);

    useLayoutEffect(() => {
        const span: any = containerRef.current;
        const container = span.parentNode;
        // populate double the container height of items
        if (container.scrollHeight <= (container.offsetHeight * 2)) {
            addItem();
            adding = false;
        }

        if (index > 0 && dataList.length === renderList.length) {
            container.removeEventListener('scroll', addItem, true);
        } else {
            container.addEventListener('scroll', addItem, true);
        }

        return () => { // when unmounted
            container.removeEventListener('scroll', addItem, true);
        };
    }, [index]);

    return (
        <>
            {renderList.map(handleRenderItem(renderItem))}
            <span ref={containerRef} style={{display: 'none'}}/>
        </>
    );
};

ScrollRenderer.propTypes = {
    list: arrayOf(any).isRequired,
    renderItem: func.isRequired
};

export default ScrollRenderer;
