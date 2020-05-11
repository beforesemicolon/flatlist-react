import {render} from '@testing-library/react';
import React from 'react';
import ScrollToTopButton from '../../src/___subComponents/ScrollToTopButton';

describe('ScrollToTopButton', () => {
    it('Should match snapshot', () => {
        const {asFragment} = render(<ScrollToTopButton/>);

        expect(asFragment()).toMatchSnapshot();
    });

    it('Should have button with initial style', () => {
        const {getAllByText} = render(<ScrollToTopButton/>);
        const btn = getAllByText('To Top')[0];

        expect(btn.style.cssText).toBe('position: fixed; z-index: 1; visibility: hidden;');
    });
});
