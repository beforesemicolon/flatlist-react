import React from 'react';
import {
    renderBlank,
    handleRenderGroupSeparator,
    handleRenderItem,
    btnPosition
} from '../../src/___subComponents/uiFunctions';
import {render} from '@testing-library/react';

describe('uiFunctions', () => {
    describe('renderBlank', () => {
        it('Should match snapshot', () => {
            const blankNoRenderWhenEmpty = renderBlank(null);
            const blankWithRenderWhenEmpty = renderBlank(() => <p>nothing</p>);
            let {asFragment: b1} = render(blankNoRenderWhenEmpty);
            let {asFragment: b2} = render(blankWithRenderWhenEmpty);

            expect(b1()).toMatchSnapshot();
            expect(b2()).toMatchSnapshot();
        });
    });

    describe('handleRenderGroupSeparator', () => {
        it('Should match snapshot', () => {
            const separator = ['___separator', 'label', []];
            const CustomSeparator = ({groupLabel}: any) => {
                return <h2>{groupLabel}</h2>
            };
            const groupSeparatorNoCustom = handleRenderGroupSeparator(null);
            const groupSeparatorWithElCustom = handleRenderGroupSeparator(CustomSeparator);
            const groupSeparatorWithElCustom2 = handleRenderGroupSeparator(<CustomSeparator/>);
            const groupSeparatorWithFnCustom = handleRenderGroupSeparator(
                ({groupLabel}: any) => <CustomSeparator groupLabel={groupLabel}/>
                );
            const {asFragment: s1} = render(groupSeparatorNoCustom(separator, 0));
            const {asFragment: s2} = render(groupSeparatorWithElCustom(separator, 0));
            const {asFragment: s3} = render(groupSeparatorWithElCustom2(separator, 0));
            const {asFragment: s4} = render(groupSeparatorWithFnCustom(separator, 0));

            expect(s1()).toMatchSnapshot();
            expect(s2()).toMatchSnapshot();
            expect(s3()).toMatchSnapshot();
            expect(s4()).toMatchSnapshot();
        });
    });

    describe('handleRenderItem', () => {
        it('Should match snapshot', () => {
            const item = {name: 'item name', id: 12};
            const itemNull = handleRenderItem(() => null);
            const itemFn = handleRenderItem((item: any, key: string) => <div key={key}>{item.name} {key}</div>);

            const {asFragment: i1} = render(itemNull(item, 0) as any);
            const {asFragment: i2} = render(itemFn(item, 0) as any);

            expect(i1()).toMatchSnapshot();
            expect(i2()).toMatchSnapshot();
        });
    });

    describe('btnPosition', () => {
        const btn = document.createElement('button');
        const container = document.createElement('div');
        container.id = 'unique-id';
        container.style.width = '200px';
        container.style.height = '200px';
        btn.innerText = 'to top';
        const pos = btnPosition(container, btn);
        container.appendChild(btn);
        document.body.appendChild(container);

        beforeAll(() => {
            jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() => {
                return {
                    left: 0,
                    top: 0,
                    width: 200,
                    height: 200,
                } as DOMRect;
            })
        });

        afterAll(() => {
            jest.resetAllMocks();
        });

        it('Should set initial style', () => {
            expect(container.id).toBe('unique-id');
            expect(container.style.cssText).toBe('width: 200px; height: 200px;');
            expect(btn.style.cssText).toBe('position: absolute; z-index: 1; visibility: hidden;');
        });

        it('Should position btn top left', (done) => {
            const raf = (cb: any) => {
                cb();
                expect(btn.style.top).toBe('20px');
                expect(btn.style.left).toBe('20px');
                done();
                return 0;
            };

            const spy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(raf);

            pos('top', 'left');

            expect(window.requestAnimationFrame).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('Should position btn top right', (done) => {
            const raf = (cb: any) => {
                cb();
                expect(btn.style.top).toBe('20px');
                expect(btn.style.left).toBe('calc(100% - 20px)');
                done();
                return 0;
            };

            const spy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(raf);

            pos('top', 'right');

            expect(window.requestAnimationFrame).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('Should position btn bottom left', (done) => {
            const raf = (cb: any) => {
                cb();
                expect(btn.style.top).toBe('calc(100% - 20px)');
                expect(btn.style.left).toBe('20px');
                done();
                return 0;
            };

            const spy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(raf);

            pos('bottom', 'left');

            expect(window.requestAnimationFrame).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('Should position btn bottom right', (done) => {
            const raf = (cb: any) => {
                cb();
                expect(btn.style.top).toBe('calc(100% - 20px)');
                expect(btn.style.left).toBe('calc(100% - 20px)');
                done();
                return 0;
            };

            const spy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(raf);

            pos('bottom', 'right');

            expect(window.requestAnimationFrame).toHaveBeenCalled();
            spy.mockRestore();
        });
    })
});
