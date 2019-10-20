import getType, {types} from './getType';

export default (list: any) => {
    const listType = getType(list);

    switch (listType) {
        case types.SET:
            return Array.from(list);
        case types.MAP:
            return Array.from(list.values());
        case types.WEAK_SET:
        case types.WEAK_MAP:
            return [];
        case types.OBJECT:
            return Object.values(list);
        default:
            return list;
    }
};
