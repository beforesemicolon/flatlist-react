const limitList = <T>(list: T[], limit: number = 0): T[] => {
    if (limit <= 0) {
        return list;
    }

    return [...list].slice(0, limit);
};

export default limitList;
