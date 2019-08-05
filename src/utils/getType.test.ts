/* tslint:disable only-arrow-functions no-empty quotemark */
import getType, {types} from './getType';

describe('Util: getType()', () => {
    // changing this testingData may change the test results
    const data: { [t: string]: any[] } = {};

    beforeAll(() => {
        data.arrays = [[], new Array(), [1, 2, 3], Array.from('test'), {a: []}.a, Array(3)];
        data.booleans = [true, false, Boolean(1), 1 === 1];
        data.functions = [() => {
        }, function() {
        }];
        data.maps = [new Map()];
        data.nulls = [null, {a: null}.a];
        data.numbers = [1, -1, 9.3, NaN, (0 / 3), Infinity];
        data.objects = [{}, new Object({}), Object.create(null)];
        data.sets = [new Set()];
        data.strings = ['123', '', `${123} - n`, 'empty', ''];
        data.symbols = [Symbol()];
        // @ts-ignore
        data.undefineds = [{random: undefined}.random, {}.x, undefined, (() => {
        })(), (() => undefined)(),
            Object.create(null).prototype];
        data.weakMaps = [new WeakMap()];
        data.weakSets = [new WeakSet()];
    });

    it('Should be of type ARRAY only those inside data.arrays', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'arrays') {
                    expect(getType(x)).toEqual(types.ARRAY);
                } else {
                    expect(getType(x)).not.toEqual(types.ARRAY);
                }
            });
        });
    });

    it('Should be of type BOOLEAN only those inside data.booleans', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'booleans') {
                    expect(getType(x)).toEqual(types.BOOLEAN);
                } else {
                    expect(getType(x)).not.toEqual(types.BOOLEAN);
                }
            });
        });
    });

    it('Should be of type FUNCTION only those inside data.functions', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'functions') {
                    expect(getType(x)).toEqual(types.FUNCTION);
                } else {
                    expect(getType(x)).not.toEqual(types.FUNCTION);
                }
            });
        });
    });

    it('Should be of type MAP only those inside data.maps', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'maps') {
                    expect(getType(x)).toEqual(types.MAP);
                } else {
                    expect(getType(x)).not.toEqual(types.MAP);
                }
            });
        });
    });

    it('Should be of type NULL only those inside data.nulls', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'nulls') {
                    expect(getType(x)).toEqual(types.NULL);
                } else {
                    expect(getType(x)).not.toEqual(types.NULL);
                }
            });
        });
    });

    it('Should be of type NUMBER only those inside data.numbers', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'numbers') {
                    expect(getType(x)).toEqual(types.NUMBER);
                } else {
                    expect(getType(x)).not.toEqual(types.NUMBER);
                }
            });
        });
    });

    it('Should be of type OBJECT only those inside data.objects', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'objects') {
                    expect(getType(x)).toEqual(types.OBJECT);
                } else {
                    expect(getType(x)).not.toEqual(types.OBJECT);
                }
            });
        });
    });

    it('Should be of type SET only those inside data.sets', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'sets') {
                    expect(getType(x)).toEqual(types.SET);
                } else {
                    expect(getType(x)).not.toEqual(types.SET);
                }
            });
        });
    });

    it('Should be of type STRING only those inside data.strings', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'strings') {
                    expect(getType(x)).toEqual(types.STRING);
                } else {
                    expect(getType(x)).not.toEqual(types.STRING);
                }
            });
        });
    });

    it('Should be of type SYMBOL only those inside data.symbols', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'symbols') {
                    expect(getType(x)).toEqual(types.SYMBOL);
                } else {
                    expect(getType(x)).not.toEqual(types.SYMBOL);
                }
            });
        });
    });

    it('Should be of type UNDEFINED only those inside data.undefineds', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'undefineds') {
                    expect(getType(x)).toEqual(types.UNDEFINED);
                } else {
                    expect(getType(x)).not.toEqual(types.UNDEFINED);
                }
            });
        });
    });

    it('Should be of type WEAK_MAP only those inside data.weakMaps', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'weakMaps') {
                    expect(getType(x)).toEqual(types.WEAK_MAP);
                } else {
                    expect(getType(x)).not.toEqual(types.WEAK_MAP);
                }
            });
        });
    });

    it('Should be of type WEAK_SET only those inside data.weakSets', () => {
        Object.keys(data).forEach((dataTypeGroup: string) => {
            data[dataTypeGroup].forEach((x: any) => {
                if (dataTypeGroup === 'weakSets') {
                    expect(getType(x)).toEqual(types.WEAK_SET);
                } else {
                    expect(getType(x)).not.toEqual(types.WEAK_SET);
                }
            });
        });
    });
});
