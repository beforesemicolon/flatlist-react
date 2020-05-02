import {element, func, node, oneOfType} from 'prop-types';
import React from 'react';
import {isFunction} from '../___utils/isType';

const ScrollToTopButton = (props: any) => {
    const {button} = props;

    const btn = isFunction(button) ? button() : button;

    if (button) {
        return <btn.type {...btn.props} className={`${btn.props.className || ''} ___to-top-btn`} />;
    }

    return (<button type="button" className="___to-top-btn">To Top</button>);
};

ScrollToTopButton.propTypes = {
    button: oneOfType([node, element, func]).isRequired
};

export default ScrollToTopButton;
