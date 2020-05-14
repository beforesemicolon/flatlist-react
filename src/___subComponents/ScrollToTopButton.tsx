import {element, func, node, number, oneOf, oneOfType, shape} from 'prop-types';
import React, {createRef, Ref, useEffect, useState} from 'react';
import {isFunction} from '../___utils/isType';
import {btnPosition} from './uiFunctions';

interface Props {
    button: JSX.Element | (() => JSX.Element);
    position: string;
    offset: number;
    padding: number;
    scrollingContainer: Ref<HTMLElement>;
}

const ScrollToTopButton = (props: Props) => {
    const anchor: Ref<HTMLElement> = createRef();
    const {button, position, padding, offset, scrollingContainer} = props;
    const btn = isFunction(button) ? (button as () => JSX.Element)() : button;
    const [mounted, setMounted] = useState(false);
    console.log('-- scrollingContainer', scrollingContainer);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        const buttonElement = (anchor as any).current.nextElementSibling;
        const container = (anchor as any).current.parentNode;
        const scrollContainer = (scrollingContainer as any).current;
        const containerStyle = getComputedStyle(container);
        container.style.overflow = 'hidden';
        container.style.position = ['absolute', 'fixed', 'relative'].includes(containerStyle.overflow)
            ? containerStyle.overflow : 'relative';
        scrollContainer.style.overflow = 'auto';
        scrollContainer.style.padding = containerStyle.padding;
        scrollContainer.style.height = '100%';
        container.style.padding = '0';
        const positionBtn = btnPosition(scrollContainer, buttonElement);
        const pos = position.split(' ');
        const updateBtnPosition = () => positionBtn(pos[0], pos[1], padding, offset);

        window.addEventListener('resize', updateBtnPosition);

        scrollContainer.addEventListener('scroll', updateBtnPosition);

        buttonElement.addEventListener('click', () => {
            scrollContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        setTimeout(() => updateBtnPosition(), 250);

        setMounted(true);
        return () => {
            window.removeEventListener('resize', updateBtnPosition);
        };
    }, []);

    return (
        <>
            {!mounted && <span ref={anchor} style={{display: 'none'}}/>}
            {button ? btn : <button type="button">To Top</button>}
        </>
    );
};

ScrollToTopButton.propTypes = {
    scrollingContainer: shape({current: oneOf([element, node])}).isRequired,
    button: oneOfType([node, element, func]),
    position: oneOf(['top right', 'top left', 'bottom right', 'bottom left']),
    padding: number,
    offset: number
};

ScrollToTopButton.defaultProps = {
    button: null,
    padding: 20,
    offset: 50,
    position: 'bottom right'
};

export default ScrollToTopButton;
