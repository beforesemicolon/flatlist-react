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
    const [render, setRender] = useState({renderList: [], index: 0, prevScrollPosition: 0});
    const [mounted, setMounted] = useState(false);
    const dataList = convertListToArray(list);
    const containerRef: any = createRef();
    let adding = false;

    const renderThisItem = handleRenderItem(renderItem, handleRenderGroupSeparator(groupSeparator));

    const addItem = (prevScrollPosition = render.prevScrollPosition) => {
        if (!adding && render.index < dataList.length) {
            adding = true;
            setRender({
                prevScrollPosition,
                renderList: [...render.renderList, dataList[render.index]] as any,
                index: render.index + 1
            });
        }
    };

    const onScroll = (e: Event) => {
        const cont: any = e.currentTarget || e.target;

        if (
            // make sure it is scrolling down
            cont.scrollTop > render.prevScrollPosition && (
                // maintain an offset equal to container height
                (cont.scrollTop + cont.offsetHeight) > (cont.scrollHeight - cont.offsetHeight)
            )
        ) {
            addItem(cont.scrollTop);
        }
    };

    useEffect(() => {
        if (mounted) { // reset list on list change
            setRender({
                renderList: [],
                index: 0,
                prevScrollPosition: 0
            });
        }
    }, [list]);

    useEffect(() => { // when mounted
        const span: any = containerRef.current;
        const container = span.parentNode;
        setMounted(true);

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

        if (render.index > 0 && dataList.length === render.renderList.length) {
            container.removeEventListener('scroll', onScroll, true);
        } else {
            container.addEventListener('scroll', onScroll, true);
        }

        return () => { // when unmounted
            container.removeEventListener('scroll', onScroll, true);
        };
    }, [render.index]);

    return (
        <>
            {render.renderList.map(renderThisItem)}
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
