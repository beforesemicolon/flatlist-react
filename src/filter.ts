import getObjectDeepKeyValue from './utils/getObjectDeepKeyValue';
import {isObject, isFunction, isString} from './utils/isType';

const filterList = <T>(list: T[], by: ((item: T, idx: number) => boolean) | string = ''): T[] => {
	const listCopy = JSON.parse(JSON.stringify(list));

	return listCopy.filter((item: T, idx: number) => {
		if ((isString(by) && isObject(item))) {
			return getObjectDeepKeyValue(by as string, item);
		}

		if (isFunction(by)) {
			const filterCallback = by as (item: T, idx: number) => boolean;
			return filterCallback(item, idx);
		}

		return true;
	});
};

export default filterList;
