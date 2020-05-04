import {any, arrayOf, element, func, node, oneOfType} from 'prop-types';
import React, {createRef, useEffect, useLayoutEffect, useState} from 'react';
import convertListToArray from '../___utils/convertListToArray';
import {handleRenderGroupSeparator, handleRenderItem, renderFunc} from './uiFunctions';

interface Props {
    list: any[];
    renderItem: JSX.Element | renderFunc;
    groupSeparator: JSX.Element | ((g: any, idx: number, label: string) => JSX.Element | null) | null;
}

const ScrollRenderer = (props: Props) => {
    const {list, renderItem, groupSeparator} = props;
    const [renderList, setRenderList] = useState([]);
    const [index, setIndex] = useState(0);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const dataList = convertListToArray(list);
    const containerRef: any = createRef();
    let adding = false;

    const renderThisItem = handleRenderItem(renderItem, handleRenderGroupSeparator(groupSeparator));

    const addItem = () => {
        if (!adding && index < dataList.length) {
            adding = true;
            setRenderList([...renderList, dataList[index]] as any);
            setIndex(index + 1);
        }
    };

    const onScroll = (e: Event) => {
        const cont: any = e.currentTarget || e.target;

        if (
            // make sure it is scrolling down
            cont.scrollTop > prevScrollPos && (
                // maintain an offset equal to container height
                (cont.scrollTop + cont.offsetHeight) > (cont.scrollHeight - cont.offsetHeight)
            )
        ) {
            addItem();
        }

        setPrevScrollPos(cont.scrollTop);
    };

    useEffect(() => {
        const span: any = containerRef.current;
        const container = span.parentNode;

        return () => { // when unmounted
            container.removeEventListener('scroll', onScroll, true);
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
            container.removeEventListener('scroll', onScroll, true);
        } else {
            container.addEventListener('scroll', onScroll, true);
        }

        return () => { // when unmounted
            container.removeEventListener('scroll', onScroll, true);
        };
    }, [index]);

    return (
        <>
            {renderList.map(renderThisItem)}
            <span ref={containerRef} style={{display: 'none'}}/>
        </>
    );
};

ScrollRenderer.propTypes = {
    list: arrayOf(any).isRequired,
    renderItem: func.isRequired,
    groupSeparator: oneOfType([node, func, element])
};

ScrollRenderer.defaultProps = {
    groupSeparator: null
};

export default ScrollRenderer;
