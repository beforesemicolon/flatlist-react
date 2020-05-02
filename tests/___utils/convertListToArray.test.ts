import convertListToArray from '../../src/___utils/convertListToArray';

describe('Util: convertListToArray()', () => {
    let arr: any[];

    beforeAll(() => {
        arr = [
            {name: 'test a'},
            {name: 'test b'},
            {name: 'test c'}
        ];
    });

    it('should convert Object to an array', () => {
        expect.assertions(1);
        const obj = {...arr};

        expect(convertListToArray(obj)).toEqual(arr);
    });

    it('should convert Set to a array', () => {
        expect.assertions(1);
        const set = new Set(arr);

        expect(convertListToArray(set)).toEqual(arr);
    });

    it('should convert Map to a array', () => {
        expect.assertions(1);
        const map = new Map(arr.map((o, i) => [i, o]));

        expect(convertListToArray(map)).toEqual(arr);
    });

    it('should convert WeakSet to an EMPTY array', () => {
        expect.assertions(1);
        const wset = new WeakSet(arr);

        expect(convertListToArray(wset)).toEqual([]);
    });

    it('should convert WeakMap to an EMPTY array', () => {
        expect.assertions(1);
        const wmap = new WeakMap(arr.map((o, i) => [{i}, o]));

        expect(convertListToArray(wmap)).toEqual([]);
    });

    it('should return array intact', () => {
        expect.assertions(1);

        expect(convertListToArray(arr)).toEqual(arr);
    });

    it('should return EMPTY array FOR anything that is not Set, Map, Object or Array', () => {
        expect.assertions(5);

        expect(convertListToArray(() => null)).toEqual([]);
        expect(convertListToArray('string')).toEqual([]);
        expect(convertListToArray(12)).toEqual([]);
        expect(convertListToArray(new WeakSet())).toEqual([]);
        expect(convertListToArray(new WeakMap())).toEqual([]);
    });
});
