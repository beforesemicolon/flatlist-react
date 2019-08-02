import getObjectDeepKeyValue from './utils/getObjectDeepKeyValue';
import {isObject, isFunction, isString} from './utils/isType';

const filterList = <T>(list: T[], by: ((item: T) => boolean) | string = ''): T[] => {
	const listCopy = JSON.parse(JSON.stringify(list));

	return listCopy.filter((item: T) => {
		if ((isString(by) && isObject(item))) {
			return getObjectDeepKeyValue(by as string, item);
		}

		if (isFunction(by)) {
			const filterCallback = by as (item: T) => boolean;
			return filterCallback(item);
		}

		return true;
	});
};

export default filterList;
