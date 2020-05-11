import React from 'react';
import DefaultLoadIndicator from './../../src/___subComponents/DefaultLoadIndicator';
import {render} from '@testing-library/react';

describe('DefaultLoadIndicator', () => {
    it('Should match snapshot', () => {
        const {asFragment} = render(<DefaultLoadIndicator/>);

        expect(asFragment()).toMatchSnapshot();
    });
});
