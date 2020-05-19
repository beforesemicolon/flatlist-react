import {any, arrayOf, element, func, node, oneOfType} from 'prop-types';
import React, {createRef, Ref, useEffect, useState} from 'react';
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
    const [setupCount, setSetupCount] = useState(0);
    const containerRef: Ref<HTMLElement> = createRef();
    let adding = false;

    const renderThisItem = handleRenderItem(renderItem, handleRenderGroupSeparator(groupSeparator));

    const addItem = (container: any, prevScrollPosition = render.prevScrollPosition) => {
        console.log('-- add item', mounted);
        if (!adding && render.index < list.length) {
            adding = true;
            // @ts-ignore
            const count = getComputedStyle(container as HTMLElement).display === 'grid' ? 10 : 5;
            console.log('-- added');
            setRender({
                prevScrollPosition,
                renderList: [...render.renderList, ...list.slice(render.index, render.index + count)] as any,
                index: render.index + count
            });
        }
    };

    const onScroll = (span: any) => () => {
        console.log('-- on scroll');
        const startingPoint = span.parentNode.offsetTop + span.parentNode.offsetHeight;
        const anchorPos = span.offsetTop - span.parentNode.scrollTop;

        if (anchorPos <= (startingPoint + (span.parentNode.offsetHeight * 2))) {
            requestAnimationFrame(() => addItem(span.parentNode, span.parentNode.scrollTop));
        }
    };

    useEffect(() => { // when mounted
        console.log('-- mounted');
        setMounted(true);

        return () => { // when unmounted
            console.log('-- un-mounted');
            setMounted(false);
        };
    }, []);

    useEffect(() => {
        console.log('-- list updated', mounted, Math.min(setupCount, list.length));
        if (mounted) { // reset list on list change
            setRender({
                renderList: list.slice(0, Math.min(setupCount, list.length)) as any,
                index: setupCount,
                prevScrollPosition: 0
            });
        }
    }, [list]);

    useEffect(() => {
        console.log('-- useLayoutEffect', render.index);
        const span: any = containerRef.current;
        let container: any = null;
        const handleScroll = onScroll(span);
        if (span) {
            container = span.parentNode;
            // populate double the container height of items
            if (render.index === 0 || container.scrollHeight <= (container.offsetHeight * 1.5)) {
                addItem(container);
            } else {
                console.log('--- setup done', render.index);
                setSetupCount(render.index);
            }

            if (render.index > 0 && list.length === render.renderList.length) {
                container.removeEventListener('scroll', handleScroll, true);
            } else {
                container.addEventListener('scroll', handleScroll, true);
            }

            adding = false;
        }

        return () => { // when unmounted
            if (span) {
                container.removeEventListener('scroll', handleScroll, true);
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
