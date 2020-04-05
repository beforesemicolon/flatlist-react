import getType, {types} from './getType';

export default (list: any): any[] => {
    const listType = getType(list);

    switch (listType) {
        case types.ARRAY:
            return list;
        case types.OBJECT:
            return Object.values(list);
        case types.SET:
            return Array.from(list);
        case types.MAP:
            return Array.from(list.values());
        default:
            return [];
    }
};
