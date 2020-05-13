import sortList from '../../src/___utils/sortList';

describe('Util sortList()', () => {

    it('Should return already sorted array intact', () => {
        expect.assertions(7);
        const numberArr1 = [1, 2, 3, 4, 5];
        const numberArr2 = [19, 13, 10, 8];
        const stringArr1 = ['a', 'b', 'b', 'c', 'f', 'z'];
        const stringArr2 = ['x', 't', 'p', 'm', 'a', 'a'];
        const stringArr3 = ['AA', 'Aa', 'a', 'aa', 'ba', 'tc'];
        const stringArr4 = ['z', 'xy', 'pa', 'p', 'lm', 'ad'];

        expect(sortList(numberArr1)).toEqual(numberArr1);
        expect(sortList(numberArr2, {descending: true})).toEqual(numberArr2);
        expect(sortList(stringArr1)).toEqual(stringArr1);
        expect(sortList(stringArr2, {descending: true})).toEqual(stringArr2);
        expect(sortList(stringArr3)).toEqual(stringArr3);
        expect(sortList(stringArr3, {caseInsensitive: true})).toEqual(['a', 'AA', 'Aa', 'aa', 'ba', 'tc']);
        expect(sortList(stringArr4, {descending: true})).toEqual(stringArr4);
    });

    it('Should sort number array desc', () => {
        expect.assertions(4);
        const numberArr1 = [4, 3, 8, 1, 9, 0];
        const numberArr2 = [0.1, -1, 18, 13, 90, 0];
        const numberArr3 = [NaN, -1, 18, 13, Infinity, 0];
        const numberArr4 = [1000.92, 5, -40, Infinity, 13, -0];

        expect(sortList(numberArr1, {descending: true})).toEqual([9, 8, 4, 3, 1, 0]);
        expect(sortList(numberArr2, {descending: true})).toEqual([90, 18, 13, 0.1, 0, -1]);
        expect(sortList(numberArr3, {descending: true})).toEqual([NaN, Infinity, 18, 13, 0, -1]);
        expect(sortList(numberArr4, {descending: true})).toEqual([Infinity, 1000.92, 13, 5, -0, -40]);
    });

    it('Should sort number array asc', () => {
        expect.assertions(4);
        const numberArr1 = [4, 3, 8, 1, 9, 0];
        const numberArr2 = [0.1, -1, 18, 13, 90, 0];
        const numberArr3 = [NaN, -1, 18, 13, Infinity, 0];
        const numberArr4 = [1000.92, 5, -40, Infinity, 13, -0];

        expect(sortList(numberArr1)).toEqual([0, 1, 3, 4, 8, 9]);
        expect(sortList(numberArr2)).toEqual([-1, 0, 0.1, 13, 18, 90]);
        expect(sortList(numberArr3)).toEqual([NaN, -1, 0, 13, 18, Infinity]);
        expect(sortList(numberArr4)).toEqual([-40, -0, 5, 13, 1000.92, Infinity]);
    });

    it('Should sort string array desc', () => {
        expect.assertions(6);
        const stringArr1 = ['a', 'aa', 'aA', 'Aa', 'b', 'BB'];
        const stringArr2 = ['c', 'a B', 'aA', 'AA', 'B', 'B 1'];
        const stringArr3 = ['9', '0 B', '1A', '-0A', 'B 32', 'z 1'];

        expect(sortList(stringArr1, {descending: true}))
            .toEqual(['b', 'aa', 'aA', 'a', 'BB', 'Aa']);
        expect(sortList(stringArr1, {descending: true, caseInsensitive: true}))
            .toEqual(['BB', 'b', 'aa', 'aA', 'Aa', 'a']);
        expect(sortList(stringArr2, {descending: true}))
            .toEqual(['c', 'aA', 'a B', 'B 1', 'B', 'AA']);
        expect(sortList(stringArr2, {descending: true, caseInsensitive: true}))
            .toEqual(['c', 'B 1', 'B', 'aA', 'AA', 'a B']);
        expect(sortList(stringArr3, {descending: true}))
            .toEqual(['z 1', 'B 32', '9', '1A', '0 B', '-0A']);
        expect(sortList(stringArr3, {descending: true, caseInsensitive: true}))
            .toEqual(['z 1', 'B 32', '9', '1A', '0 B', '-0A']);
    });

    it('Should sort string array asc', () => {
        expect.assertions(6);
        const stringArr1 = ['a', 'aa', 'aA', 'Aa', 'b', 'BB'];
        const stringArr2 = ['c', 'a B', 'aA', 'AA', 'B', 'B 1'];
        const stringArr3 = ['9', '0 B', '1A', '-0A', 'B 32', 'z 1'];

        expect(sortList(stringArr1)).toEqual(['Aa', 'BB', 'a', 'aA', 'aa', 'b', ]);
        expect(sortList(stringArr1, {caseInsensitive: true}))
            .toEqual(['a', 'aa', 'aA', 'Aa', 'b', 'BB']);
        expect(sortList(stringArr2)).toEqual(['AA', 'B', 'B 1', 'a B', 'aA', 'c']);
        expect(sortList(stringArr2, {caseInsensitive: true}))
            .toEqual(['a B', 'aA', 'AA', 'B', 'B 1', 'c']);
        expect(sortList(stringArr3)).toEqual(['-0A', '0 B', '1A', '9', 'B 32', 'z 1']);
        expect(sortList(stringArr3, {caseInsensitive: true}))
            .toEqual(['-0A', '0 B', '1A', '9', 'B 32', 'z 1']);
    });

    it('Should sort object array by name desc', () => {
        expect.assertions(6);
        const objectArr1 = [{name: 'a'}, {name: 'aa'}, {name: 'aA'}, {name: 'Aa'}, {name: 'b'}, {name: 'BB'}];
        const objectArr2 = [{name: 'c'}, {name: 'a B'}, {name: 'aA'}, {name: 'AA'}, {name: 'B'}, {name: 'B 1'}];
        const objectArr3 = [{name: '9'}, {name: '0 B'}, {name: '1A'}, {name: '-0A'}, {name: 'B 32'}, {name: 'z 1'}];

        expect(sortList(objectArr1, {descending: true, by: 'name'}))
            .toEqual([{name: 'b'}, {name: 'aa'}, {name: 'aA'}, {name: 'a'}, {name: 'BB'}, {name: 'Aa'}]);
        expect(sortList(objectArr1, {descending: true, caseInsensitive: true, by: 'name'}))
            .toEqual([{name: 'BB'}, {name: 'b'}, {name: 'aa'}, {name: 'aA'}, {name: 'Aa'}, {name: 'a'}]);
        expect(sortList(objectArr2, {descending: true, by: 'name'}))
            .toEqual([{name: 'c'}, {name: 'aA'}, {name: 'a B'}, {name: 'B 1'}, {name: 'B'}, {name: 'AA'}]);
        expect(sortList(objectArr2, {descending: true, caseInsensitive: true, by: 'name'}))
            .toEqual([{name: 'c'}, {name: 'B 1'}, {name: 'B'}, {name: 'aA'}, {name: 'AA'}, {name: 'a B'}]);
        expect(sortList(objectArr3, {descending: true, by: 'name'}))
            .toEqual([{name: 'z 1'}, {name: 'B 32'}, {name: '9'}, {name: '1A'}, {name: '0 B'}, {name: '-0A'}]);
        expect(sortList(objectArr3, {descending: true, caseInsensitive: true, by: 'name'}))
            .toEqual([{name: 'z 1'}, {name: 'B 32'}, {name: '9'}, {name: '1A'}, {name: '0 B'}, {name: '-0A'}]);
    });

    it('Should sort object array by name asc', () => {
        expect.assertions(6);
        const stringArr1 = [{name: 'a'}, {name: 'aa'}, {name: 'aA'}, {name: 'Aa'}, {name: 'b'}, {name: 'BB'}];
        const stringArr2 = [{name: 'c'}, {name: 'a B'}, {name: 'aA'}, {name: 'AA'}, {name: 'B'}, {name: 'B 1'}];
        const stringArr3 = [{name: '9'}, {name: '0 B'}, {name: '1A'}, {name: '-0A'}, {name: 'B 32'}, {name: 'z 1'}];

        expect(sortList(stringArr1, {by: 'name'}))
            .toEqual([{name: 'Aa'}, {name: 'BB'}, {name: 'a'}, {name: 'aA'}, {name: 'aa'}, {name: 'b'}]);
        expect(sortList(stringArr1, {caseInsensitive: true, by: 'name'}))
            .toEqual([{name: 'a'}, {name: 'aa'}, {name: 'aA'}, {name: 'Aa'}, {name: 'b'}, {name: 'BB'}]);
        expect(sortList(stringArr2, {by: 'name'}))
            .toEqual([{name: 'AA'}, {name: 'B'}, {name: 'B 1'}, {name: 'a B'}, {name: 'aA'}, {name: 'c'}]);
        expect(sortList(stringArr2, {caseInsensitive: true, by: 'name'}))
            .toEqual([{name: 'a B'}, {name: 'aA'}, {name: 'AA'}, {name: 'B'}, {name: 'B 1'}, {name: 'c'}]);
        expect(sortList(stringArr3, {by: 'name'}))
            .toEqual([{name: '-0A'}, {name: '0 B'}, {name: '1A'}, {name: '9'}, {name: 'B 32'}, {name: 'z 1'}]);
        expect(sortList(stringArr3, {caseInsensitive: true, by: 'name'}))
            .toEqual([{name: '-0A'}, {name: '0 B'}, {name: '1A'}, {name: '9'}, {name: 'B 32'}, {name: 'z 1'}]);
    });

    it('Should sort object array by count desc', () => {
        expect.assertions(4);
        const numberArr1 = [{count: 4}, {count: 3}, {count: 8}, {count: 1}, {count: 9}, {count: 0}];
        const numberArr2 = [{count: 0.1}, {count: -1}, {count: 18}, {count: 13}, {count: 90}, {count: 0}];
        const numberArr3 = [{count: NaN}, {count: -1}, {count: 18}, {count: 13}, {count: Infinity}, {count: 0}];
        const numberArr4 = [{count: 1000.92}, {count: 5}, {count: -40}, {count: Infinity}, {count: 13}, {count: -0}];

        expect(sortList(numberArr1, {descending: true, by: 'count'}))
            .toEqual([{count: 9}, {count: 8}, {count: 4}, {count: 3}, {count: 1}, {count: 0}]);
        expect(sortList(numberArr2, {descending: true, by: 'count'}))
            .toEqual([{count: 90}, {count: 18}, {count: 13}, {count: 0.1}, {count: 0}, {count: -1}]);
        expect(sortList(numberArr3, {descending: true, by: 'count'}))
            .toEqual([{count: NaN}, {count: Infinity}, {count: 18}, {count: 13}, {count: 0}, {count: -1}]);
        expect(sortList(numberArr4, {descending: true, by: 'count'}))
            .toEqual([{count: Infinity}, {count: 1000.92}, {count: 13}, {count: 5}, {count: -0}, {count: -40}]);
    });

    it('Should sort object array by count asc', () => {
        expect.assertions(4);
        const numberArr1 = [{count: 4}, {count: 3}, {count: 8}, {count: 1}, {count: 9}, {count: 0}];
        const numberArr2 = [{count: 0.1}, {count: -1}, {count: 18}, {count: 13}, {count: 90}, {count: 0}];
        const numberArr3 = [{count: NaN}, {count: -1}, {count: 18}, {count: 13}, {count: Infinity}, {count: 0}];
        const numberArr4 = [{count: 1000.92}, {count: 5}, {count: -40}, {count: Infinity}, {count: 13}, {count: -0}];

        expect(sortList(numberArr1, {by: 'count'}))
            .toEqual([{count: 0}, {count: 1}, {count: 3}, {count: 4}, {count: 8}, {count: 9}]);
        expect(sortList(numberArr2, {by: 'count'}))
            .toEqual([{count: -1}, {count: 0}, {count: 0.1}, {count: 13}, {count: 18}, {count: 90}]);
        expect(sortList(numberArr3, {by: 'count'}))
            .toEqual([{count: NaN}, {count: -1}, {count: 0}, {count: 13}, {count: 18}, {count: Infinity}]);
        expect(sortList(numberArr4, {by: 'count'}))
            .toEqual([{count: -40}, {count: -0}, {count: 5}, {count: 13}, {count: 1000.92}, {count: Infinity}]);
    });

    it('Should sort on many keys', () => {
        const objectArray = [
            {name: 'Last', other: 'Zer', age: 2},
            {name: 'First', other: 'Last', age: 8},
            {name: 'Middle', other: 'Zer', age: 1},
            {name: 'First', other: 'Middle', age: 8},
            {name: 'Last', other: 'Abo', age: 2}
        ];

        expect(sortList(objectArray, {
            by: ['name', 'other'],
            descending: false,
            caseInsensitive: false,
        })).toEqual([
            {name: 'First', other: 'Last', age: 8},
            {name: 'First', other: 'Middle', age: 8},
            {name: 'Last', other: 'Abo', age: 2},
            {name: 'Last', other: 'Zer', age: 2},
            {name: 'Middle', other: 'Zer', age: 1},
        ])

        expect(sortList(objectArray, {
            by: ['name', {key: 'other', descending: true}],
            descending: false,
            caseInsensitive: false,
        })).toEqual([
            {name: 'First', other: 'Middle', age: 8},
            {name: 'First', other: 'Last', age: 8},
            {name: 'Last', other: 'Zer', age: 2},
            {name: 'Last', other: 'Abo', age: 2},
            {name: 'Middle', other: 'Zer', age: 1},
        ])

        expect(sortList(objectArray, {
            by: ['name', {key: 'age', descending: true}],
            descending: false,
            caseInsensitive: false,
        })).toEqual([
            {name: 'First', other: 'Last', age: 8},
            {name: 'First', other: 'Middle', age: 8},
            {name: 'Last', other: 'Zer', age: 2},
            {name: 'Last', other: 'Abo', age: 2},
            {name: 'Middle', other: 'Zer', age: 1},
        ])

        expect(sortList(objectArray, {
            by: ['name', 'other'],
            descending: true,
            caseInsensitive: false,
        })).toEqual([
            {name: 'Middle', other: 'Zer', age: 1},
            {name: 'Last', other: 'Zer', age: 2},
            {name: 'Last', other: 'Abo', age: 2},
            {name: 'First', other: 'Middle', age: 8},
            {name: 'First', other: 'Last', age: 8},
        ])

        expect(sortList(objectArray, {
            by: ['age', 'other'],
            descending: true,
            caseInsensitive: false,
        })).toEqual([
            {name: 'First', other: 'Middle', age: 8},
            {name: 'First', other: 'Last', age: 8},
            {name: 'Last', other: 'Zer', age: 2},
            {name: 'Last', other: 'Abo', age: 2},
            {name: 'Middle', other: 'Zer', age: 1},
        ])

        expect(sortList(objectArray, {
            by: [{key: 'age', descending: false}, 'other'],
            descending: true,
            caseInsensitive: false,
        })).toEqual([
            {name: 'Middle', other: 'Zer', age: 1},
            {name: 'Last', other: 'Zer', age: 2},
            {name: 'Last', other: 'Abo', age: 2},
            {name: 'First', other: 'Middle', age: 8},
            {name: 'First', other: 'Last', age: 8},
        ])
    });

    it('Should keep the same for object or array arrays if key is no found', () => {
        expect.assertions(2);
        const objectArray = [{name: 'Ta'}, {count: 1}];
        const arrayArray = [[{name: 'Ta'}], [{count: 1}]];

        expect(sortList(objectArray, {by: 'name'})).toEqual([{name: 'Ta'}, {count: 1}]);
        expect(sortList(arrayArray, {by: '0.count'})).toEqual([[{name: 'Ta'}], [{count: 1}]]);
    });
});
