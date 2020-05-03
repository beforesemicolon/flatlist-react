import {any, arrayOf, func, objectOf} from 'prop-types';
import React, {createRef, forwardRef, Ref, useEffect, useLayoutEffect, useState, useMemo} from 'react';
import convertListToArray from '../___utils/convertListToArray';
import {renderFunc} from './uiFunctions';

interface Props {
    list: any[];
    renderItem: JSX.Element | renderFunc;
    renderWhenEmpty: null | (() => JSX.Element);
    __forwarededRef: {};
}

const withScrollRenderer = (List: any) => {
    function ScrollRenderList(props: Props) {
        console.log('-- hehehe');
        // const [renderList, setRenderList] = useState([]);
        // const containerRef: any = createRef();
        // const [index, setIndex] = useState(0);
        const {list, renderItem, renderWhenEmpty, __forwarededRef, ...remainderProps} = props;
        const dataList = convertListToArray(list);
        // let adding = false;

        // const addItem = () => {
        //     if (!adding && index < dataList.length) {
        //         adding = true;
        //         setRenderList([...renderList, dataList[index]] as any);
        //         setIndex(index + 1);
        //     }
        // };

        // useEffect(() => {
        //     const {current} = (__forwarededRef || containerRef);
        //
        //     return () => { // when unmounted
        //         if (current) {
        //             current.removeEventListener('scroll', addItem, true);
        //         }
        //     };
        // }, []);

        // useLayoutEffect(() => {
        //     const {current} = (__forwarededRef || containerRef);
        //
        //     if (current) {
        //         // populate double the container height of items
        //         if (current.scrollHeight <= (current.offsetHeight * 2)) {
        //             addItem();
        // { /*        } */ }

        //         adding = false;
        //
        // { /*        if (index > 0 && dataList.length === renderList.length) { */ }
        //             current.removeEventListener('scroll', addItem, true);
        //         } else {
        //             current.addEventListener('scroll', addItem, true);
        //         }
        //     }
        //
        //     return () => { // when unmounted
        //         if (current) {
        //             current.removeEventListener('scroll', addItem, true);
        //         }
        //     };
        // }, [index]);

        return <List {...props} ref={__forwarededRef} list={list}/>;
    }

    ScrollRenderList.propTypes = {
        list: arrayOf(any).isRequired,
        renderItem: func.isRequired,
        renderWhenEmpty: func.isRequired,
        __forwarededRef: objectOf(any)
    };

    ScrollRenderList.defaultProps = {
        __forwarededRef: {}
    };

    return forwardRef((props: Props, ref: Ref<HTMLElement>) => (
        <ScrollRenderList __forwarededRef={ref} {...props} />
    ));
};


export default withScrollRenderer;
