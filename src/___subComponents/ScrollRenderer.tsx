import {any, arrayOf, element, func, node, oneOfType} from 'prop-types';
import React, {createRef, Ref, useEffect, useLayoutEffect, useState} from 'react';
import {handleRenderGroupSeparator, handleRenderItem, renderFunc} from './uiFunctions';

interface Props {
    list: any[];
    renderItem: JSX.Element | renderFunc;
    groupSeparator: JSX.Element | ((g: any, idx: number, label: string) => JSX.Element | null) | null;
}

const ScrollRenderer = (props: Props) => {
    const {list, renderItem, groupSeparator} = props;
    const [render, setRender] = useState({renderList: [], index: 0});
    const [mounted, setMounted] = useState(false);
    const [setupCount, setSetupCount] = useState(-1);
    const containerRef: Ref<HTMLElement> = createRef();

    const renderThisItem = handleRenderItem(renderItem, handleRenderGroupSeparator(groupSeparator));

    const updateRenderInfo = (count = 10) => {
        if (render.index < list.length) {
            const index = render.index + count;
            setRender({
                renderList: list.slice(0, index) as any,
                index
            });
        }
    };

    const onScroll = (span: any) => () => {
        requestAnimationFrame(() => {
            if (span) {
                const startingPoint = span.parentNode.offsetTop + span.parentNode.offsetHeight;
                const anchorPos = span.offsetTop - span.parentNode.scrollTop;

                if (anchorPos <= (startingPoint + (span.parentNode.offsetHeight * 2))) {
                    updateRenderInfo();
                }
            }
        });
    };

    useEffect(() => { // when mounted
        setMounted(true);

        return () => { // when unmounted
            setMounted(false);
        };
    }, []);

    useLayoutEffect(() => {
        if (mounted) { // reset list on list change
            const span: any = containerRef.current;
            const pos = span.parentNode.scrollTop;
            const index = Math.max(render.renderList.length, setupCount);

            setRender({
                renderList: list.slice(0, index) as any,
                index
            });

            requestAnimationFrame(() => {
                if (span && span.parentNode) {
                    span.parentNode.scrollTop = pos;
                }
            });
        }
    }, [list]);

    useLayoutEffect(() => {
        const span: any = containerRef.current;
        const handleScroll = onScroll(span);
        let container: any = null;

        if (span) {
            container = span.parentNode;
            requestAnimationFrame(() => {
                // populate double the container height of items
                if (render.index === 0 || (container.scrollHeight <= (container.offsetHeight * 2))) {
                    updateRenderInfo();
                } else if (setupCount === -1) {
                    setSetupCount(render.index);
                }
            });

            container.addEventListener('scroll', handleScroll, {passive: true});
        }

        return () => { // when unmounted
            if (span) {
                container.removeEventListener('scroll', handleScroll, {passive: true});
            }
        };
    }, [render.index, list.length]);

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
