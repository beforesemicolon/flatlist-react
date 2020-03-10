import searchList from '../../src/utils/searchList';

describe('Util: searchList()', () => {
    const objectArrays = [{name: 'Last'}, {name: 'First'}, {name: 'First middle'}, {name: 'Last back'}];

    it('Should search on specified provided string "by" with/without options', () => {
        expect.assertions(16);

        const search = (term: string, caseInsensitive: boolean, everyWord: boolean) =>
            searchList(objectArrays, {
                by: 'name',
                caseInsensitive,
                everyWord,
                term
            });

        expect(search('first', false, false)).toHaveLength(0);
        expect(search('first', false, false)).toEqual([]);

        expect(search('first', true, false)).toHaveLength(2);
        expect(search('first', true, false))
            .toEqual([{name: 'First'}, {name: 'First middle'}]);

        expect(search('first', true, true)).toHaveLength(2);
        expect(search('first', true, true))
            .toEqual([{name: 'First'}, {name: 'First middle'}]);

        expect(search('first', false, true)).toHaveLength(0);
        expect(search('first', false, true)).toEqual([]);

        expect(search('first Mid Back', false, false)).toHaveLength(0);
        expect(search('first Mid Back', false, false)).toEqual([]);

        expect(search('first Mid Back', true, false)).toHaveLength(0);
        expect(search('first Mid Back', true, false)).toEqual([]);

        expect(search('first Mid Back', true, true)).toHaveLength(3);
        expect(search('first Mid Back', true, true))
            .toEqual([{name: 'First'}, {name: 'First middle'}, {name: 'Last back'}]);

        expect(search('first Mid Back', false, true)).toHaveLength(0);
        expect(search('first Mid Back', false, true)).toEqual([]);
    });

    it('Should search using function "by" with/without options', () => {
        // expect.assertions(8);

        const search = (term: string, caseInsensitive: boolean, everyWord: boolean) =>
            searchList(objectArrays, {
                by: (item, searchTerm: string) =>
                    (caseInsensitive ? item.name.toLowerCase() : item.name).search(searchTerm) >= 0,
                caseInsensitive,
                everyWord,
                term
            });

        expect(search('first', false, false)).toHaveLength(0);
        expect(search('first', false, false)).toEqual([]);

        expect(search('first', true, false)).toHaveLength(2);
        expect(search('first', true, false))
            .toEqual([{name: 'First'}, {name: 'First middle'}]);

        expect(search('first', true, true)).toHaveLength(2);
        expect(search('first', true, true))
            .toEqual([{name: 'First'}, {name: 'First middle'}]);

        expect(search('first', false, true)).toHaveLength(0);
        expect(search('first', false, true)).toEqual([]);

        expect(search('first Mid Back', false, false)).toHaveLength(0);
        expect(search('first Mid Back', false, false)).toEqual([]);

        expect(search('first Mid Back', true, false)).toHaveLength(0);
        expect(search('first Mid Back', true, false)).toEqual([]);

        expect(search('first Mid Back', true, true)).toHaveLength(3);
        expect(search('first Mid Back', true, true))
            .toEqual([{name: 'First'}, {name: 'First middle'}, {name: 'Last back'}]);

        expect(search('first Mid Back', false, true)).toHaveLength(0);
        expect(search('first Mid Back', false, true)).toEqual([]);
    });
});
