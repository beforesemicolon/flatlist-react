import {any, arrayOf, element, func, node, oneOfType} from 'prop-types';
import React, {createRef, useEffect, useLayoutEffect, useState, Ref} from 'react';
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
    const containerRef: Ref<HTMLElement> = createRef();
    let adding = false;

    const renderThisItem = handleRenderItem(renderItem, handleRenderGroupSeparator(groupSeparator));

    const addItem = (container: any, prevScrollPosition = render.prevScrollPosition) => {
        if (!adding && render.index < dataList.length) {
            adding = true;
            // @ts-ignore
            const count = getComputedStyle(container as HTMLElement).display === 'grid' ? 10 : 5;
            setRender({
                prevScrollPosition,
                renderList: [...render.renderList, ...dataList.slice(render.index, render.index + count)] as any,
                index: render.index + count
            });
        }
    };

    const onScroll = () => {
        const span: any = containerRef.current;

        if (span) {
            const startingPoint = span.parentNode.offsetTop + span.parentNode.offsetHeight;
            const anchorPos = span.offsetTop - span.parentNode.scrollTop;

            if (anchorPos <= (startingPoint + (span.parentNode.offsetHeight * 2))) {
                requestAnimationFrame(() => addItem(span.parentNode, span.parentNode.scrollTop));
            }
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
        setMounted(true);

        return () => { // when unmounted
            if (containerRef.current) {
                (containerRef as any).current.parentNode.removeEventListener('scroll', onScroll, true);
            }
        };
    }, []);

    useLayoutEffect(() => {
        const span: any = containerRef.current;
        if (span) {
            // populate double the container height of items
            if (span.parentNode.scrollHeight <= (span.parentNode.offsetHeight * 2)) {
                requestAnimationFrame(() => addItem(span.parentNode));
            }

            if (render.index > 0 && dataList.length === render.renderList.length) {
                span.parentNode.removeEventListener('scroll', onScroll, true);
            } else {
                span.parentNode.addEventListener('scroll', onScroll, true);
            }

            adding = false;
        }

        return () => { // when unmounted
            if (span) {
                span.parentNode.removeEventListener('scroll', onScroll, true);
            }
        };
    }, [render.index]);

    return (
        <>
            {render.renderList.map(renderThisItem)}
            <span ref={containerRef} style={{visibility: 'hidden', height: 1}} className="___scroll-renderer-anchor"/>
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
