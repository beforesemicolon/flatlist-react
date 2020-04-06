import groupList from '../../src/___utils/groupList';

describe('Util: groupList()', () => {

    it('Should return array of ONE list if no or invalid options provided', () => {
        expect.assertions(3);
        const list = [1, 3, 45, 8, 0];

        const groupedList = groupList(list);

        expect(groupedList.groupLists).toHaveLength(1);
        expect(groupedList.groupLists).toEqual([list]);
        expect(groupedList.groupLabels).toHaveLength(0);
    });

    it('Should return array groups length matching "limit" option', () => {
        expect.assertions(4);
        const list = [1, 3, 45, 8, 0, 20, 10];

        const groupedList = groupList(list, {limit: 2});

        expect(groupedList.groupLists).toHaveLength(4);
        expect(groupedList.groupLists).toEqual([[1, 3], [45, 8], [0, 20], [10]]);
        expect(groupedList.groupLabels).toHaveLength(4);
        expect(groupedList.groupLabels).toEqual([1, 2, 3, 4]);
    });

    it('Should group list by age', () => {
        expect.assertions(4);
        const list = [{age: 1}, {age: 3}, {age: 45}, {age: 8}, {age: 0}, {age: 20}, {age: 10}];

        const groupBy: (item: any, idx: number) => string | number = (item: any) => {
            return item.age % 2 === 0 ? 'divided by 2' : 'not divided by 2';
        };

        const groupedList = groupList(list, {by: groupBy});

        expect(groupedList.groupLists).toHaveLength(2);
        expect(groupedList.groupLists)
            .toEqual([[{age: 1}, {age: 3}, {age: 45}], [{age: 8}, {age: 0}, {age: 20}, {age: 10}]]);
        expect(groupedList.groupLabels).toHaveLength(2);
        expect(groupedList.groupLabels).toEqual(['not divided by 2', 'divided by 2']);
    });

    it('Should group list by age with group length be max 2', () => {
        expect.assertions(4);
        const list = [{age: 1}, {age: 3}, {age: 45}, {age: 8}, {age: 0}, {age: 20}, {age: 10}];

        const groupBy: (item: any, idx: number) => string | number = (item: any) => {
            return item.age % 2 === 0 ? 'divided by 2' : 'not divided by 2';
        };

        const groupedList = groupList(list, {by: groupBy, limit: 2});

        expect(groupedList.groupLists).toHaveLength(2);
        expect(groupedList.groupLists)
            .toEqual([[{age: 1}, {age: 3}], [{age: 8}, {age: 0}]]);
        expect(groupedList.groupLabels).toHaveLength(2);
        expect(groupedList.groupLabels).toEqual(['not divided by 2', 'divided by 2']);
    });
});
