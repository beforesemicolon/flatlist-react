/* tslint:disable only-arrow-functions no-empty quotemark */
import getObjectDeepKeyValue from '../../src/___utils/getObjectDeepKeyValue';

interface TestingObjectInterface {
    [s: string]: any;
}

describe('Util: getObjectDeepKeyValue()', () => {

    const testingObject: TestingObjectInterface = {
        children: [
            {
                age: 3,
                name: 'Jane Doe',
            },
            {
                age: 3,
                name: 'Another Doe',
            }
        ],
        name: 'John Doe',
        map: new Map([['one', 1], ['two', 2]]),
        personalInfo: {
            age: 28,
            height: '5\'11',
            weight: '200lb',
            years: new Set(['1999', '2000', '2001', '2018'])
        }
    };
    const testingArray: TestingObjectInterface[] = [];

    beforeAll(() => {
        testingArray.push(testingObject);
    });

    it('Should get one level deep key values in an object', () => {
        const objectKey1: string = 'children';
        const objectKey2: string = 'name';
        const objectKey3: string = 'personalInfo';

        expect.assertions(3);
        expect(getObjectDeepKeyValue(testingObject, objectKey1)).toEqual(testingObject[objectKey1]);
        expect(getObjectDeepKeyValue(testingObject, objectKey2)).toEqual(testingObject[objectKey2]);
        expect(getObjectDeepKeyValue(testingObject, objectKey3)).toEqual(testingObject[objectKey3]);
    });

    it('Should get one level deep key values in an array', () => {
        const arrKey: any = '0';
        const arrKey2: any = '*';

        expect.assertions(1);

        expect(getObjectDeepKeyValue(testingArray, arrKey)).toEqual(testingArray[arrKey]);
    });

    it('Should get several levels deep key values in an object', () => {
        const objectKey1: string = 'children.0.name';
        const objectKey2: string = 'children.1.age';
        const objectKey3: string = 'personalInfo.weight';
        const objectKey4: string = 'personalInfo.years.1';
        const objectKey5: string = 'map.one';

        expect.assertions(5);
        expect(getObjectDeepKeyValue(testingObject, objectKey1)).toEqual(testingObject.children[0].name);
        expect(getObjectDeepKeyValue(testingObject, objectKey2)).toEqual(testingObject.children[1].age);
        expect(getObjectDeepKeyValue(testingObject, objectKey3)).toEqual(testingObject.personalInfo.weight);
        expect(getObjectDeepKeyValue(testingObject, objectKey4)).toEqual('2000');
        expect(getObjectDeepKeyValue(testingObject, objectKey5)).toEqual(1);
    });

    it('Should get several levels deep key values in an array', () => {
        const arrKey1: string = '0.children.0.name';
        const arrKey2: string = '0.children.1.age';
        const arrKey3: string = '0.personalInfo.weight';
        const arrKey4: string = '0.personalInfo.years.1';
        const arrKey5: string = '0.map.one';

        expect.assertions(5);
        expect(getObjectDeepKeyValue(testingArray, arrKey1)).toEqual(testingArray[0].children[0].name);
        expect(getObjectDeepKeyValue(testingArray, arrKey2)).toEqual(testingArray[0].children[1].age);
        expect(getObjectDeepKeyValue(testingArray, arrKey3)).toEqual(testingArray[0].personalInfo.weight);
        expect(getObjectDeepKeyValue(testingArray, arrKey4)).toEqual('2000');
        expect(getObjectDeepKeyValue(testingArray, arrKey5)).toEqual(1);
    });

    it('Should return null when key does not exists', () => {
        const objectKey1: string = 'children.0.nothing'; // nothing does not exists
        const objectKey2: string = 'children.2.age'; // 2 does not exists
        const objectKey3: string = 'personalInfo.dominance'; // dominance does not exists
        const arrKey1: string = '0.children.0.error'; // error does not exists
        const arrKey2: string = '3.children.1.age'; // 3 does not exists
        const arrKey3: string = '0.test.weight'; // test does not exists

        expect.assertions(6);
        expect(getObjectDeepKeyValue(testingObject, objectKey1)).toBe(null);
        expect(getObjectDeepKeyValue(testingObject, objectKey2)).toBe(null);
        expect(getObjectDeepKeyValue(testingObject, objectKey3)).toBe(null);
        expect(getObjectDeepKeyValue(testingArray, arrKey1)).toBe(null);
        expect(getObjectDeepKeyValue(testingArray, arrKey2)).toBe(null);
        expect(getObjectDeepKeyValue(testingArray, arrKey3)).toBe(null);
    });

    it('Should be undefined when not OBJECT or ARRAY is passed as hey-stack', () => {
        expect.assertions(3);

        expect(getObjectDeepKeyValue('', 'children')).toBeNull();
        expect(getObjectDeepKeyValue(() => {}, 'children')).toBeNull();
        expect(getObjectDeepKeyValue(new Map(), 'children')).toBeNull();
    });

    it('Should throw an error when not STRING is passed as key', () => {
        expect.assertions(3);

        // @ts-ignore
        expect(() => getObjectDeepKeyValue([testingObject, ]))
            .toThrowError('getObjectDeepKeyValue: "dotSeparatedKeys" is not a dot separated values string');
        // @ts-ignore
        expect(() => getObjectDeepKeyValue(testingArray, 1))
            .toThrowError('getObjectDeepKeyValue: "dotSeparatedKeys" is not a dot separated values string');
        // @ts-ignore
        expect(() => getObjectDeepKeyValue({testingObject, }))
            .toThrowError('getObjectDeepKeyValue: "dotSeparatedKeys" is not a dot separated values string');
    });

    it('Should get special key values', () => {
        const k1: any = 'children.0';
        const k2: any = '*keys';

        // expect.assertions(1);

        expect(getObjectDeepKeyValue(testingArray, k2)).toEqual([]);
    });
});
