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
    const [render, setRender] = useState({renderList: [], index: 0, prevScrollPosition: 0});
    const [mounted, setMounted] = useState(false);
    const [setupCount, setSetupCount] = useState(0);
    const containerRef: Ref<HTMLElement> = createRef();
    let adding = false;

    const renderThisItem = handleRenderItem(renderItem, handleRenderGroupSeparator(groupSeparator));

    const addItem = ({container = null, count = 5, prevScrollPosition = render.prevScrollPosition}) => {
        console.log('-- add item', mounted);
        if (!adding && render.index < list.length) {
            adding = true;
            // @ts-ignore
            count = getComputedStyle(container as HTMLElement).display === 'grid' ? 10 : count;
            console.log('-- added');
            setRender({
                prevScrollPosition,
                renderList: [...render.renderList, ...list.slice(render.index, render.index + count)] as any,
                index: render.index + count
            });
        }
    };

    const onScroll = (span: any) => () => {
        console.log('-- on scroll', list.length, render.renderList.length, list);
        if (list.length !== render.renderList.length) {
            const startingPoint = span.parentNode.offsetTop + span.parentNode.offsetHeight;
            const anchorPos = span.offsetTop - span.parentNode.scrollTop;

            if (anchorPos <= (startingPoint + (span.parentNode.offsetHeight * 2))) {
                requestAnimationFrame(() => addItem({
                    container: span.parentNode,
                    prevScrollPosition: span.parentNode.scrollTop
                }));
            }
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
        console.log('-- list updated', mounted, list);
        if (mounted) { // reset list on list change
            const index = Math.min(setupCount, list.length);
            console.log('-- new index', index);
            setRender({
                renderList: list.slice(0, index) as any,
                index,
                prevScrollPosition: 0
            });
        }
    }, [list]);

    useLayoutEffect(() => {
        console.log('-- useLayoutEffect', render.index);
        const span: any = containerRef.current;
        let container: any = null;
        const handleScroll = onScroll(span);
        if (span) {
            container = span.parentNode;
            // populate double the container height of items
            if (render.index === 0 || container.scrollHeight <= (container.offsetHeight * 1.5)) {
                requestAnimationFrame(() => addItem({container, count: 10}));
            } else {
                console.log('--- setup done', render.index);
                setSetupCount(render.index);
            }

            console.log('-- add scroll');
            container.addEventListener('scroll', handleScroll, true);

            adding = false;
        }

        return () => { // when unmounted
            if (span) {
                container.removeEventListener('scroll', handleScroll, true);
            }
        };
    }, [render.index]);

    console.log('-- render.renderList', render.renderList.length);
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
