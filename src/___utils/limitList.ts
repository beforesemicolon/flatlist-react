import {isNumeric} from './isType';

const limitList = <T>(list: T[], limit: string | number = 0, to: string | number | undefined = undefined): T[] => {
    if (!limit || Number(limit) <= 0 || Number(limit) >= list.length) {
        return list;
    }

    if (to === undefined) {
        return list.slice(0, Number(limit));
    }

    return (to === '' || Number(to) === 0 || isNumeric(Number(to)))
        ? list.slice(Number(limit))
        : list.slice(Number(limit), Number(to));
};

export default limitList;
