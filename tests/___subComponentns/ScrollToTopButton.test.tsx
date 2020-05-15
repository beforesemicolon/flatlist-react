import {render} from '@testing-library/react';
import React, {createRef} from 'react';
import ScrollToTopButton from '../../src/___subComponents/ScrollToTopButton';

describe('ScrollToTopButton', () => {
    it('Should match snapshot', () => {
        const ref: any = createRef();
        const {asFragment} = render(
            <div ref={ref}>
                <ScrollToTopButton scrollingContainer={ref}/>
            </div>);

        expect(asFragment()).toMatchSnapshot();
    });

    it('Should have button with initial style', () => {
        const ref: any = createRef();
        const {getAllByText} = render(
            <div ref={ref}>
                <ScrollToTopButton scrollingContainer={ref}/>
            </div>
        );
        const btn = getAllByText('To Top')[0];

        expect(btn.style.cssText).toBe('position: absolute; z-index: 1; visibility: hidden;');
    });
});
