import {element, func, node, number, oneOf, oneOfType} from 'prop-types';
import React, {createRef, Ref, useEffect} from 'react';
import {isFunction} from '../___utils/isType';
import {btnPosition} from './uiFunctions';

const ScrollToTopButton = (props: any) => {
    const anchor: Ref<HTMLElement> = createRef();
    const {button, scrollToTopPosition, scrollToTopPadding, scrollToTopOffset} = props;
    const btn = isFunction(button) ? button() : button;

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        const buttonElement = (anchor as any).current.nextElementSibling;
        const container = (anchor as any).current.parentNode;
        (anchor as any).current.remove();

        const positionBtn = btnPosition(container, buttonElement);
        const pos = scrollToTopPosition.split(' ');
        const updateBtnPosition = () => positionBtn(pos[0], pos[1], scrollToTopPadding, scrollToTopOffset);
        window.addEventListener('resize', updateBtnPosition);
        container.addEventListener('scroll', updateBtnPosition);

        buttonElement.addEventListener('click', () => {
            container.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        setTimeout(() => updateBtnPosition(), 250);

        return () => {
            window.removeEventListener('resize', updateBtnPosition);
        };
    }, []);

    return (
        <>
            <span ref={anchor} style={{display: 'none'}}/>
            {button ? btn : <button type="button">To Top</button>}
        </>
    );
};

ScrollToTopButton.propTypes = {
    button: oneOfType([node, element, func]),
    scrollToTopPosition: oneOf(['top right', 'top left', 'bottom right', 'bottom left']),
    scrollToTopPadding: number,
    scrollToTopOffset: number
};

ScrollToTopButton.defaultProps = {
    button: null,
    scrollToTopPadding: 20,
    scrollToTopOffset: 50,
    scrollToTopPosition: 'bottom right'
};

export default ScrollToTopButton;
