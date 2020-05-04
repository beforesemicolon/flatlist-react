import React, {useEffect} from 'react';
import {element, func, node, oneOfType} from 'prop-types';

import {isFunction} from '../___utils/isType';

const ScrollToTopButton = (props: any) => {
    const {button} = props;

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        // if (__forwarededRef) {
        //     const {current}: any = __forwarededRef;
        //
        //     if (wrapperHtmlTag && current) {
        //         const btn = current.querySelector('.___to-top-btn');
        //         const positionBtn = btnPosition(current, btn);
        //         const pos = scrollToTopPosition.split(' ');
        //         const updateBtnPosition = () => positionBtn(pos[0], pos[1], scrollToTopPadding, scrollToTopOffset);
        //         // eslint-disable-next-line no-undef
        //         window.addEventListener('resize', updateBtnPosition);
        //         current.addEventListener('scroll', updateBtnPosition);
        //
        //         btn.addEventListener('click', () => {
        //             current.scrollTo({
        //                 top: 0,
        //                 behavior: 'smooth'
        //             });
        //         });
        //
        //         setTimeout(() => updateBtnPosition(), 250);
        //
        //         return () => {
        //             // eslint-disable-next-line no-undef
        //             window.removeEventListener('resize', updateBtnPosition);
        //         };
        //     }
        // }
    }, []);

    const btn = isFunction(button) ? button() : button;

    if (button) {
        return <btn.type {...btn.props} className={`${btn.props.className || ''} ___to-top-btn`} />;
    }

    return (<button type="button" className="___to-top-btn">To Top</button>);
};

ScrollToTopButton.propTypes = {
    button: oneOfType([node, element, func])
};

ScrollToTopButton.defaultProps = {
    button: null
};

export default ScrollToTopButton;
