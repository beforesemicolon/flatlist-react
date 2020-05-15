import React from 'react';
import PlainList from '../../src/___subComponents/PlainList';
import {render} from '@testing-library/react';

describe('PlainList', () => {
    const list = [
        {name: 'item-1'},
        {name: 'item-2'},
        {name: 'item-3'}
    ];

    it('Should render items', () => {
        const {asFragment, getAllByText} = render(
            <PlainList
                list={list}
                renderItem={(item: any, k: any) => <li key={k}>{item.name}</li>}
            />
        );

        const items = getAllByText(/item-*/);

        expect(asFragment()).toMatchSnapshot();
        expect(items.length).toBe(3);
        expect(items.map(item => item.textContent)).toEqual(['item-1', 'item-2', 'item-3']);
    });

    it('Should render items wrapped in a tag', () => {
        const {asFragment, container} = render(
            <PlainList
                list={list}
                renderItem={(item: any, k: any) => <li key={k}>{item.name}</li>}
                wrapperHtmlTag="div"
                id="container"
            />
        );

        expect(asFragment()).toMatchSnapshot();
        expect(container.children[0].id).toBe('container');
    });

    it('Should render blank with empty list', () => {
        const {asFragment, getByText} = render(<PlainList list={[]} renderItem={() => null}/>);

        expect(asFragment()).toMatchSnapshot();
        expect(getByText('List is empty...').outerHTML).toBe('<p>List is empty...</p>');
    });

    it('Should render provided blank with empty list', () => {
        const {asFragment, getByText} = render(<PlainList list={[]} renderItem={() => null}
                                                          renderWhenEmpty={() => <div>Empty</div>}/>);

        expect(asFragment()).toMatchSnapshot();
        expect(getByText('Empty').outerHTML).toBe('<div>Empty</div>');
    });
});
