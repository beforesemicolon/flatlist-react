import {
    isFunction,
    isNil,
    isString,
    isArray,
    isNumber,
    isObject,
    isNumeric,
    isBoolean,
    isObjectLiteral
} from '../../src/utils/isType';

describe('Util: isType()', () => {
    const data: { [t: string]: any[] } = {};

    beforeAll(() => {
        const ObjConstructor = function() {
            // @ts-ignore
            this.object = {};
        };

        data.arrays = [[], new Array(), [1, 2, 3], Array.from('test'), {a: []}.a, Array(3)];
        data.functions = [() => {
            // tslint:disable-next-line:only-arrow-functions
        }, function() {
        }];
        data.nils = [null, '', ``, [], {}, undefined, 0];
        data.booleans = [true, false, 1 === 1, 10 > 5];
        data.numbers = [1, -1, 9.3, NaN, (0 / 3), Infinity, 0];
        data.numerics = [1, -1, 9.3, (0 / 3), 0];
        // @ts-ignore
        data.objects = [{}, new Object({}), Object.create(null), new ObjConstructor()];
        // @ts-ignore
        data.objectLiterals = [{}, new Object({})];
        data.strings = ['123', '', `${123} - n`, 'empty', ''];
    });

    it('Should be boolean only those in data.booleans', () => {
        expect.assertions(data.booleans.length);
        data.booleans.forEach((x: any) => {
            expect(isBoolean(x)).toBe(true);
        });
    });

    it('Should be functions only those in data.functions', () => {
        expect.assertions(data.functions.length);
        data.functions.forEach((x: any) => {
            expect(isFunction(x)).toBe(true);
        });
    });

    it('Should be string only those in data.strings', () => {
        expect.assertions(data.strings.length);
        data.strings.forEach((x: any) => {
            expect(isString(x)).toBe(true);
        });
    });

    it('Should be nil only those in data.nils', () => {
        expect.assertions(data.nils.length);
        data.nils.forEach((x: any) => {
            expect(isNil(x)).toBe(true);
        });
    });

    it('Should be array only those in data.arrays', () => {
        expect.assertions(data.arrays.length);
        data.arrays.forEach((x: any) => {
            expect(isArray(x)).toBe(true);
        });
    });

    it('Should be object only those in data.objects', () => {
        expect.assertions(data.objects.length);
        data.objects.forEach((x: any) => {
            expect(isObject(x)).toBe(true);
        });
    });

    it('Should be object literal only those in data.objectLiterals', () => {
        expect.assertions(data.objectLiterals.length);
        data.objectLiterals.forEach((x: any) => {
            expect(isObjectLiteral(x)).toBe(true);
        });
    });

    it('Should be number only those in data.numbers', () => {
        expect.assertions(data.numbers.length);
        data.numbers.forEach((x: any) => {
            expect(isNumber(x)).toBe(true);
        });
    });

    it('Should be numeric only those in data.numerics', () => {
        expect.assertions(data.numerics.length);
        data.numerics.forEach((x: any) => {
            expect(isNumeric(x)).toBe(true);
        });
    });

});
