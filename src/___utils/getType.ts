interface StringObjectInterface {
    [t: string]: string;
}

const typesMap: StringObjectInterface = {
    array: 'ARRAY',
    boolean: 'BOOLEAN',
    function: 'FUNCTION',
    map: 'MAP',
    null: 'NULL',
    number: 'NUMBER',
    object: 'OBJECT',
    set: 'SET',
    string: 'STRING',
    symbol: 'SYMBOL',
    undefined: 'UNDEFINED',
    weakMap: 'WEAK_MAP',
    weakSet: 'WEAK_SET'
};

export const types: StringObjectInterface = Object.values(typesMap)
    .reduce((obj: StringObjectInterface, type: string): StringObjectInterface => {
        obj[type] = type;
        return obj;
    }, {});

const getType = (x: any): string => {
    const type: string = typeof x;

    switch (type) {
        case 'number':
        case 'string':
        case 'boolean':
        case 'undefined':
        case 'symbol':
        case 'function':
            return typesMap[type];
        default:
            return x === null ? typesMap.null
                : (x instanceof Set) ? typesMap.set
                    : (x instanceof WeakSet) ? typesMap.weakSet
                        : (x instanceof Map) ? typesMap.map
                            : (x instanceof WeakMap) ? typesMap.weakMap
                                : Array.isArray(x) ? typesMap.array
                                    : typesMap.object; // otherwise it is an object
    }
};

export default getType;
