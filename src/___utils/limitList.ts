const limitList = <T>(list: T[], limit = 0): T[] => {
    if (limit <= 0 || limit >= list.length) {
        return list;
    }

    return list.slice(0, limit);
};

export default limitList;
