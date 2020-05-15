import {render, cleanup, fireEvent, act} from '@testing-library/react';
import React from 'react';
import FlatList from '../src/flatlist-react';

jest.spyOn(React, 'createRef').mockImplementation(() => ({current: null}));

describe('FlatList', () => {
    let list = [
        {firstName: 'John', lastName: 'Doe', age: 1},
        {firstName: 'April', lastName: 'zune', age: 3},
        {firstName: 'June', lastName: 'doe', age: 45},
        {firstName: 'Anibal', lastName: 'Zombie', age: 8},
        {firstName: 'anibal', lastName: 'Doe', age: 0},
        {firstName: 'April', lastName: 'fools', age: 20},
        {firstName: 'april', lastName: 'doe', age: 10}
    ];
    const renderItem = (item: any, k: any) => {
        // console.log('-- item', item, k);
        return <li key={k}>age-{item.age === undefined ? item : item.age}</li>;
    };
    const renderNamedItem = (item: any, k: any) => <li key={k}>{item.firstName} {item.lastName}</li>;

    describe('Should render', () => {
        afterEach(cleanup);

        it('items', () => {
            const {asFragment, getAllByText} = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                />
            );

            const items = getAllByText(/age-*/);

            expect(asFragment()).toMatchSnapshot();
            expect(items.length).toBe(7);
            expect(items.map(item => item.textContent)).toEqual([
                'age-1',
                'age-3',
                'age-45',
                'age-8',
                'age-0',
                'age-20',
                'age-10',
            ]);
        });

        it('limited items', () => {
            const {getAllByText} = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    limit={3}
                />
            );

            const items = getAllByText(/age-*/);

            expect(items.length).toBe(3);
            expect(items.map(item => item.textContent)).toEqual([
                'age-1',
                'age-3',
                'age-45'
            ]);
        });

        it('reversed items', () => {
            const {getAllByText} = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    reversed
                />
            );

            const items = getAllByText(/age-*/);

            expect(items.length).toBe(7);
            expect(items.map(item => item.textContent)).toEqual([
                'age-10',
                'age-20',
                'age-0',
                'age-8',
                'age-45',
                'age-3',
                'age-1',
            ]);
        });

        it('different list types', () => {
            const l1 = render(<FlatList list={{age: 1}} renderItem={renderItem}/>);
            const l2 = render(<FlatList list={new Set([{age: 1}])} renderItem={renderItem}/>);
            const l3 = render(<FlatList list={new Map([['age', 1]])} renderItem={renderItem}/>);

            expect(l1.container.children[0].outerHTML).toEqual('<li>age-1</li>');
            expect(l2.container.children[0].outerHTML).toEqual('<li>age-1</li>');
            expect(l3.container.children[0].outerHTML).toEqual('<li>age-1</li>');
        });

        it('items wrapped in a tag', () => {
            const {asFragment, container} = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    wrapperHtmlTag="div"
                    id="container"
                />
            );

            expect(asFragment()).toMatchSnapshot();
            expect(container.children[0].id).toBe('container');
        });

        it('default blank with empty list', () => {
            const {asFragment, getByText} = render(<FlatList list={[]} renderItem={renderItem}/>);

            expect(asFragment()).toMatchSnapshot();
            expect(getByText('List is empty...').outerHTML).toBe('<p>List is empty...</p>');
        });

        it('provided blank with empty list', () => {
            const {asFragment, getByText} = render(<FlatList list={[]} renderItem={() => null}
                                                             renderWhenEmpty={() => <div>Empty</div>}/>);

            expect(asFragment()).toMatchSnapshot();
            expect(getByText('Empty').outerHTML).toBe('<div>Empty</div>');
        });

        it('on scroll', () => {
            const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
                cb(1);
                return 1;
            });
            const container = document.createElement('div');
            container.id = 'container';
            Object.defineProperty(container, 'scrollHeight', {
                get() {
                    return this.children.length * 25;
                }
            });
            Object.defineProperty(container, 'offsetHeight', {
                get() {
                    return 50;
                }
            });
            const span = document.createElement('span');
            Object.defineProperty(span, 'offsetTop', {
                get() {
                    console.log('-- offsetTop');
                    return container.children.length * 25;
                }
            });

            const {asFragment, getAllByText} = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    renderOnScroll
                />,
                {container}
            );

            // initial render
            console.log('-- container', container.outerHTML);
            let items = getAllByText(/age-.*/);

            expect(asFragment()).toMatchSnapshot();
            expect(items.length).toBe(5);
            expect(items.map(i => i.textContent)).toEqual(['age-1', 'age-3', 'age-45', 'age-8', 'age-0']);

            // scroll render
            fireEvent.scroll(container, {target: {scrollTop: 150}});

            items = getAllByText(/age-.*/);

            expect(container.scrollTop).toBe(150);
            expect(asFragment()).toMatchSnapshot();
            expect(items.length).toBe(7);
            expect(items.map(i => i.textContent)).toEqual(['age-1', 'age-3', 'age-45', 'age-8', 'age-0', 'age-20', 'age-10']);
            raf.mockClear();
        });
    });

    describe('Should group', () => {
        const sep = (g: any, i: any, groupLabel: string) => <div className="separator">{groupLabel}</div>;
        const groupByFn = (item: any) => item.age >= 18 ? 'Over or 18' : 'Under 18';

        afterEach(cleanup);

        it('items limited', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    groupOf={3}
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    group={{
                        limit: 3
                    }}
                />
            );

            const frag = l1.asFragment();

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(frag).toMatchSnapshot();
            expect([...l1.container.children as any].map(i => i.nodeName))
                .toEqual(['HR', 'LI', 'LI', 'LI', 'HR', 'LI', 'LI', 'LI', 'HR', 'LI']);
            expect([...l1.container.querySelectorAll('li') as any].map(i => i.textContent))
                .toEqual(['age-1', 'age-3', 'age-45', 'age-8', 'age-0', 'age-20', 'age-10']);
        });

        it('by 3 with default separator at the top', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    groupOf={3}
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    group={{
                        limit: 3
                    }}
                />
            );

            const frag = l1.asFragment();

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(frag).toMatchSnapshot();
            expect(frag.querySelectorAll('.___list-separator').length).toBe(3);
            expect(frag.querySelectorAll('li').length).toBe(list.length);
            expect((l1.container.firstChild as any).nodeName).toBe('HR');
        });

        it('by 3 with default separator at the bottom', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    groupOf={3}
                    groupSeparatorAtTheBottom
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    group={{
                        of: 3,
                        separatorAtTheBottom: true
                    }}
                />
            );

            const frag = l1.asFragment();

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(frag).toMatchSnapshot();
            expect(frag.querySelectorAll('.___list-separator').length).toBe(3);
            expect(frag.querySelectorAll('li').length).toBe(list.length);
            expect((l1.container.lastChild as any).nodeName).toBe('HR');
        });

        it('with custom separator ', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    groupOf={3}
                    groupSeparator={sep}
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    group={{
                        limit: 3,
                        separator: sep
                    }}
                />
            );

            const frag = l1.asFragment();

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(frag).toMatchSnapshot();
            expect(frag.querySelectorAll('.___list-separator').length).toBe(3);
            expect(frag.querySelectorAll('.separator').length).toBe(3);
            expect([...frag.querySelectorAll('.separator') as any].map(s => s.textContent)).toEqual(['1','2', '3']);
            expect(frag.querySelectorAll('li').length).toBe(list.length);
        });

        it('items reversed', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    groupOf={3}
                    groupReversed
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    group={{
                        of: 3,
                        reversed: true
                    }}
                />
            );

            const frag = l1.asFragment();

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(frag).toMatchSnapshot();
            expect([...l1.container.querySelectorAll('li') as any].map(i => i.textContent))
                .toEqual(['age-45', 'age-3', 'age-1', 'age-20', 'age-0', 'age-8', 'age-10']);
        });

        it('items by over 18', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    groupBy={groupByFn}
                    groupSeparator={sep}
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    group={{
                        by: groupByFn,
                        separator: sep
                    }}
                />
            );

            const frag = l1.asFragment();
            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(frag).toMatchSnapshot();
            expect(frag.querySelectorAll('.___list-separator').length).toBe(2);
            expect([...l1.container.children as any].map(i => i.textContent))
                .toEqual(['Under 18', 'age-1', 'age-3', 'age-8', 'age-0', 'age-10', 'Over or 18', 'age-45', 'age-20']);
        });

        it('sorted', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    groupBy={groupByFn}
                    groupSeparator={sep}
                    groupSortedBy="age"
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    group={{
                        by: groupByFn,
                        separator: sep,
                        sortedBy: 'age'
                    }}
                />
            );

            const frag = l1.asFragment();

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(frag).toMatchSnapshot();
            expect(frag.querySelectorAll('.___list-separator').length).toBe(2);
            expect([...l1.container.children as any].map(i => i.textContent))
                .toEqual(['Under 18', 'age-0', 'age-1', 'age-3', 'age-8', 'age-10', 'Over or 18', 'age-20', 'age-45']);

            l1.rerender(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    groupBy={groupByFn}
                    groupSeparator={sep}
                    sortGroupBy="age"
                    sortGroupDesc
                />
            );
            l2.rerender(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    group={{
                        by: groupByFn,
                        separator: sep,
                        sortBy: 'age',
                        sortDescending: true
                    }}
                />
            );

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect([...l1.container.children as any].map(i => i.textContent))
                .toEqual(['Under 18', 'age-10', 'age-8', 'age-3', 'age-1', 'age-0', 'Over or 18', 'age-45', 'age-20']);
        });
    });

    describe('Should sort', () => {
        afterEach(cleanup);

        it('number list', () => {
            const nList = list.map(i => i.age);
            const l1 = render(
                <FlatList
                    list={nList}
                    renderItem={renderItem}
                    sort
                />
            );

            let items = [...l1.container.children as any];

            expect(items.map(i => i.textContent)).toEqual([
                'age-0',
                'age-1',
                'age-3',
                'age-8',
                'age-10',
                'age-20',
                'age-45',
            ]);

            l1.rerender(
                <FlatList
                    list={nList}
                    renderItem={renderItem}
                    sort
                    sortDescending
                />
            );

            items = [...l1.container.children as any];

            expect(items.map(i => i.textContent)).toEqual([
                'age-45',
                'age-20',
                'age-10',
                'age-8',
                'age-3',
                'age-1',
                'age-0',
            ]);
        });

        it('by age', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    sortBy="age"
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    sort={{
                        by: 'age'
                    }}
                />
            );

            let items = [...l1.container.children as any];

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(items.map(i => i.textContent)).toEqual([
                'age-0',
                'age-1',
                'age-3',
                'age-8',
                'age-10',
                'age-20',
                'age-45',
            ]);
        });

        it('by age descending', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    sortBy="age"
                    sortDescending
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    sort={{
                        by: 'age',
                        descending: true
                    }}
                />
            );

            let items = [...l1.container.children as any];

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(items.map(i => i.textContent)).toEqual([
                'age-45',
                'age-20',
                'age-10',
                'age-8',
                'age-3',
                'age-1',
                'age-0',
            ]);
        });

        it('by firstName and lastName descending and case sensitive', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    sortBy={['firstName', 'lastName']}
                    sortDescending
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    sort={{
                        by: ['firstName', 'lastName'],
                        descending: true
                    }}
                />
            );

            let items = [...l1.container.children as any];

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(items.map(i => i.textContent)).toEqual([
                'april doe',
                'anibal Doe',
                'June doe',
                'John Doe',
                'April zune',
                'April fools',
                'Anibal Zombie',
            ]);

        });

        it('by firstName and lastName ascending and case sensitive', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    sortBy={['firstName', 'lastName']}
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    sort={{
                        by: ['firstName', 'lastName']
                    }}
                />
            );

            let items = [...l1.container.children as any];

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(items.map(i => i.textContent)).toEqual([
                'Anibal Zombie',
                'April fools',
                'April zune',
                'John Doe',
                'June doe',
                'anibal Doe',
                'april doe',
            ]);
        });

        it('by firstName and lastName descending and case insensitive', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    sortBy={['firstName', 'lastName']}
                    sortDescending
                    sortCaseInsensitive
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    sort={{
                        by: ['firstName', 'lastName'],
                        descending: true,
                        caseInsensitive: true
                    }}
                />
            );

            let items = [...l1.container.children as any];

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(items.map(i => i.textContent)).toEqual([
                'June doe',
                'John Doe',
                'April zune',
                'April fools',
                'april doe',
                'Anibal Zombie',
                'anibal Doe',
            ]);
        });

        it('by firstName (descending case insensitive) and lastName (ascending case sensitive)', () => {
            const l1 =render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    sortBy={['firstName', {key: 'lastName', descending: false, caseInsensitive: false}]}
                    sortDescending
                    sortCaseInsensitive
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    sort={{
                        by: ['firstName', {key: 'lastName', descending: false, caseInsensitive: false}],
                        descending: true,
                        caseInsensitive: true
                    }}
                />
            );

            let items = [...l1.container.children as any];

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(items.map(i => i.textContent)).toEqual([
                'June doe',
                'John Doe',
                'april doe',
                'April fools',
                'April zune',
                'anibal Doe',
                'Anibal Zombie'
            ]);
        });

        it('by lastName (ascending case sensitive) and firstName (ascending case sensitive)', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    sortBy={[{key: 'lastName', descending: true, caseInsensitive: false}, 'firstName']}
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    sort={{
                        by: [{key: 'lastName', descending: true, caseInsensitive: false}, 'firstName']
                    }}
                />
            );

            let items = [...l1.container.children as any];

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(items.map(i => i.textContent)).toEqual([
                'April zune',
                'April fools',
                'June doe',
                'april doe',
                'Anibal Zombie',
                'John Doe',
                'anibal Doe'
            ]);
        });
    });

    describe('Should filter', () => {
        afterEach(cleanup);

        it('by age (string)', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    filterBy="age"
                />
            );

            let items = [...l1.container.children as any];

            expect(items.map(i => i.textContent)).toEqual([
                'age-1',
                'age-3',
                'age-45',
                'age-8',
                'age-20',
                'age-10',
            ]);
        });

        it('by age (function)', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    filterBy={(i: any) => i.age >= 10}
                />
            );

            let items = [...l1.container.children as any];

            expect(items.map(i => i.textContent)).toEqual([
                'age-45',
                'age-20',
                'age-10'
            ]);
        });
    });

    describe('Should search', () => {
        afterEach(cleanup);

        it('with default', () => {
            const searchTerm = 'Apr';
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    searchTerm={searchTerm}
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    search={{
                        term: searchTerm
                    }}
                />
            );

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(l1.container.outerHTML).toEqual('<div><p>List is empty...</p></div>');

            l1.rerender(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    searchTerm={searchTerm}
                    searchBy="firstName"
                />
            );
            l2.rerender(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    search={{
                        term: searchTerm,
                        by: 'firstName'
                    }}
                />
            );

            let items = [...l1.container.children as any];

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(items.map(i => i.textContent)).toEqual([
                'April zune',
                'April fools'
            ]);
        });

        it('on every word', () => {
            const searchTerm = 'Doe apr';
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    searchTerm={searchTerm}
                    searchBy={['firstName', 'lastName']}
                    searchOnEveryWord
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    search={{
                        term: searchTerm,
                        by: ['firstName', 'lastName'],
                        onEveryWord: true
                    }}
                />
            );

            let items = [...l1.container.children as any];

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(items.map(i => i.textContent)).toEqual([
                'John Doe',
                'anibal Doe',
                'april doe',
            ]);
        });

        it('on every word case insensitive', () => {
            const searchTerm = 'doe ani';
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    searchTerm={searchTerm}
                    searchBy={['firstName', 'lastName']}
                    searchOnEveryWord
                    searchCaseInsensitive
                />
            );
            const l2 = render(
                <FlatList
                    list={list}
                    renderItem={renderNamedItem}
                    search={{
                        term: searchTerm,
                        by: ['firstName', 'lastName'],
                        onEveryWord: true,
                        caseInsensitive: true
                    }}
                />
            );

            let items = [...l1.container.children as any];

            expect(l1.container.outerHTML).toEqual(l2.container.outerHTML);
            expect(items.map(i => i.textContent)).toEqual([
                'John Doe',
                'June doe',
                'Anibal Zombie',
                'anibal Doe',
                'april doe'
            ]);
        });
    });

    describe('Should paginate', () => {
        let randomList: any[] = [];
        const hasMore = () => {
            return randomList.length < 10;
        };
        const loadMore = () => {
            randomList = randomList.concat(Array(5).fill(0).map((x, i) => randomList.length + (i+1)));
        };

        beforeEach(() => {
            randomList = Array(5).fill(0).map((x, i) => (i+1));
        });

        afterEach(cleanup);

        it('on scroll', () => {
            const container = document.createElement('div');
            container.id = 'container';
            container.style.height = '50px';
            Object.defineProperty(container, 'scrollHeight', {
                get() {
                    return this.children.length * 15;
                }
            });

            const l1 = render(
                <FlatList
                    list={randomList}
                    renderItem={renderItem}
                    hasMoreItems={hasMore()}
                    loadMoreItems={loadMore}
                />,
                {container}
            );

            let loadingIndicator: any = container.querySelector('.__infinite-loader');

            expect(l1.asFragment()).toMatchSnapshot();
            expect(l1.getAllByText(/age-.*/).length).toBe(5);
            expect(loadingIndicator.style.justifyContent).toBe('flex-start');
            expect(loadingIndicator.style.visibility).toBe('visible');
            expect(loadingIndicator.style.padding).toBe('5px 0px');
            expect(loadingIndicator.style.height).toBe('auto');
            expect(loadingIndicator.children[0].textContent).toBe('loading...');

            fireEvent.scroll(container, {target: {scrollTop: 120}});

            l1.rerender(
                <FlatList
                    list={randomList}
                    renderItem={renderItem}
                    hasMoreItems={hasMore()}
                    loadMoreItems={loadMore}
                />
            );

            expect(l1.asFragment()).toMatchSnapshot();
            expect(l1.getAllByText(/age-.*/).length).toBe(10);
            expect(loadingIndicator.style.visibility).toBe('hidden');
            expect(loadingIndicator.style.padding).toBe('0px');
            expect(loadingIndicator.style.height).toBe('0px');
            expect(loadingIndicator.children[0]).toBeUndefined();
        });

        it('with custom loading indicator ', () => {
            const l1 = render(
                <FlatList
                    list={randomList}
                    renderItem={renderItem}
                    hasMoreItems
                    loadMoreItems={() => null}
                    paginationLoadingIndicator={() => <div>Loading Items...</div>}
                    paginationLoadingIndicatorPosition="center"
                />
            );

            let loadingIndicator: any = l1.container.querySelector('.__infinite-loader');

            expect(l1.asFragment()).toMatchSnapshot();
            expect(l1.getByText('Loading Items...')).toBeDefined();
            expect(loadingIndicator.style.justifyContent).toBe('center');

            l1.rerender(
                <FlatList
                    list={randomList}
                    renderItem={renderItem}
                    hasMoreItems
                    loadMoreItems={() => null}
                    paginationLoadingIndicator={() => <div>Loading Items...</div>}
                    paginationLoadingIndicatorPosition="right"
                />
            );

            expect(loadingIndicator.style.justifyContent).toBe('flex-end');
        });
    });

    describe('Should style', () => {
        afterEach(cleanup);

        it('grid', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    displayGrid
                    gridGap="50px"
                    minColumnWidth="100px"
                />
            );

            const id = l1.container.dataset.cont;
            const style = getComputedStyle(l1.container);
            const styleElement = document.querySelector(`style#${id}`) as HTMLStyleElement;

            expect(styleElement).toBeDefined();
            expect(style.display).toBe('grid');
            expect(style.gap).toBe('50px');
            expect(style.gridTemplateColumns).toBe('repeat(auto-fill, minmax(100px, 1fr))');

            l1.unmount();

            expect(document.querySelector(`style#${id}`)).toBe(null);
        });

        it('row', () => {
            const l1 = render(
                <FlatList
                    list={list}
                    renderItem={renderItem}
                    displayRow
                    rowGap="50px"
                />
            );

            const id = l1.container.dataset.cont;
            const containerStyle = getComputedStyle(l1.container);
            const itemStyle = getComputedStyle(l1.container.children[0]);

            expect(document.querySelector(`style#${id}`)).toBeDefined();
            expect(containerStyle.display).toBe('flex');
            expect(containerStyle.flexDirection).toBe('column');
            expect(itemStyle.display).toBe('block');
            expect(itemStyle.flex).toBe('1');
            expect(itemStyle.width).toBe('100%');
            expect(itemStyle.marginBottom).toBe('50px');

            l1.unmount();

            expect(document.querySelector(`style#${id}`)).toBe(null);
        });
    });
});
