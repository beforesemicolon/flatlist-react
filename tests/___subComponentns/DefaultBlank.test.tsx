import React from 'react';
import DefaultBlank from './../../src/___subComponents/DefaultBlank';
import {render} from '@testing-library/react';

describe('DefaultBlank', () => {
    it('Should match snapshot', () => {
        const {asFragment} = render(<DefaultBlank/>);

        expect(asFragment()).toMatchSnapshot();
    });
});
