/* tslint:disable only-arrow-functions no-empty quotemark */
import getObjectDeepKeyValue from '../../src/utils/getObjectDeepKeyValue';

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
        personalInfo: {
            age: 28,
            height: '5\'11',
            weight: '200lb'
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
        expect(getObjectDeepKeyValue(objectKey1, testingObject)).toEqual(testingObject[objectKey1]);
        expect(getObjectDeepKeyValue(objectKey2, testingObject)).toEqual(testingObject[objectKey2]);
        expect(getObjectDeepKeyValue(objectKey3, testingObject)).toEqual(testingObject[objectKey3]);
    });

    it('Should get one level deep key values in an array', () => {
        const arrKey: any = '0';

        expect.assertions(1);

        expect(getObjectDeepKeyValue(arrKey, testingArray)).toEqual(testingArray[arrKey]);
    });

    it('Should get several levels deep key values in an object', () => {
        const objectKey1: string = 'children.0.name';
        const objectKey2: string = 'children.1.age';
        const objectKey3: string = 'personalInfo.weight';

        expect.assertions(3);
        expect(getObjectDeepKeyValue(objectKey1, testingObject)).toEqual(testingObject.children[0].name);
        expect(getObjectDeepKeyValue(objectKey2, testingObject)).toEqual(testingObject.children[1].age);
        expect(getObjectDeepKeyValue(objectKey3, testingObject)).toEqual(testingObject.personalInfo.weight);
    });

    it('Should get several levels deep key values in an array', () => {
        const arrKey1: string = '0.children.0.name';
        const arrKey2: string = '0.children.1.age';
        const arrKey3: string = '0.personalInfo.weight';

        expect.assertions(3);
        expect(getObjectDeepKeyValue(arrKey1, testingArray)).toEqual(testingArray[0].children[0].name);
        expect(getObjectDeepKeyValue(arrKey2, testingArray)).toEqual(testingArray[0].children[1].age);
        expect(getObjectDeepKeyValue(arrKey3, testingArray)).toEqual(testingArray[0].personalInfo.weight);
    });

    it('Should throw an error when key does not exists', () => {
        const objectKey1: string = 'children.0.nothing'; // nothing does not exists
        const objectKey2: string = 'children.2.age'; // 2 does not exists
        const objectKey3: string = 'personalInfo.dominance'; // dominance does not exists
        const arrKey1: string = '0.children.0.error'; // error does not exists
        const arrKey2: string = '3.children.1.age'; // 3 does not exists
        const arrKey3: string = '0.test.weight'; // test does not exists

        expect.assertions(6);
        expect(() => getObjectDeepKeyValue(objectKey1, testingObject))
            .toThrowError(`getObjectDeepKeyValue: "nothing" is undefined.`);
        expect(() => getObjectDeepKeyValue(objectKey2, testingObject))
            .toThrowError(`getObjectDeepKeyValue: "2" is undefined.`);
        expect(() => getObjectDeepKeyValue(objectKey3, testingObject))
            .toThrowError(`getObjectDeepKeyValue: "dominance" is undefined.`);
        expect(() => getObjectDeepKeyValue(arrKey1, testingArray))
            .toThrowError(`getObjectDeepKeyValue: "error" is undefined.`);
        expect(() => getObjectDeepKeyValue(arrKey2, testingArray))
            .toThrowError(`getObjectDeepKeyValue: "3" is undefined.`);
        expect(() => getObjectDeepKeyValue(arrKey3, testingArray))
            .toThrowError(`getObjectDeepKeyValue: "test" is undefined.`);
    });

    it('Should throw an error when not OBJECT or ARRAY is passed as hey-stack', () => {
        expect.assertions(3);

        // @ts-ignore
        expect(() => getObjectDeepKeyValue('children', ''))
            .toThrowError('getObjectDeepKeyValue: dot separated keys is not a string or object is not an object.');
        // @ts-ignore
        expect(() => getObjectDeepKeyValue('children', () => {
        }))
            .toThrowError('getObjectDeepKeyValue: dot separated keys is not a string or object is not an object.');
        // @ts-ignore
        expect(() => getObjectDeepKeyValue('children', new Map()))
            .toThrowError('getObjectDeepKeyValue: dot separated keys is not a string or object is not an object.');
    });

    it('Should throw an error when not STRING is passed as key', () => {
        expect.assertions(3);

        // @ts-ignore
        expect(() => getObjectDeepKeyValue([], testingObject))
            .toThrowError('getObjectDeepKeyValue: dot separated keys is not a string or object is not an object.');
        // @ts-ignore
        expect(() => getObjectDeepKeyValue(1, testingArray))
            .toThrowError('getObjectDeepKeyValue: dot separated keys is not a string or object is not an object.');
        // @ts-ignore
        expect(() => getObjectDeepKeyValue({}, testingObject))
            .toThrowError('getObjectDeepKeyValue: dot separated keys is not a string or object is not an object.');
    });
});
