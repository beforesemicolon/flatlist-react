import filterList from './filterList';

describe('Util: filterList()', () => {

    it('Should filter list given a string "by"', () => {
        const objectList = [{age: 2}, {age: 45}, {age: 10}, {age: null}, {age: 0}];
        const arrayList = [[{age: 2}], [{age: 45}], [{age: 10}], [{age: null}], [{age: 0}]];

        const filteredObjectList = filterList(objectList, 'age');
        const filteredArrayList = filterList(arrayList, '0.age');

        expect(filteredObjectList).toEqual([{age: 2}, {age: 45}, {age: 10}]);
        expect(filteredObjectList.length).toBe(3);

        expect(filteredArrayList).toEqual([[{age: 2}], [{age: 45}], [{age: 10}]]);
        expect(filteredArrayList.length).toBe(3);
    });

    it('Should filter list given a function "by"', () => {
        const objectList = [{age: 2}, {age: 45}, {age: 10}, {age: null}, {age: 0}];
        const arrayList = [[{age: 2}], [{age: 45}], [{age: 10}], [{age: null}], [{age: 0}]];

        const filteredObjectList = filterList(objectList, (item: any) => item.age && item.age > 10);
        const filteredArrayList = filterList(arrayList, (item: any) => item[0] && item[0].age && item[0].age >= 10);

        expect(filteredObjectList).toEqual([{age: 45}]);
        expect(filteredObjectList.length).toBe(1);

        expect(filteredArrayList).toEqual([[{age: 45}], [{age: 10}]]);
        expect(filteredArrayList.length).toBe(2);
    });
});
