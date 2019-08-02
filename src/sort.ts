import getObjectDeepKeyValue from './utils/getObjectDeepKeyValue';
import {isNumber, isObject} from './utils/isType';

export interface SortOptionsInterface {
	onKey?: string;
	descending?: boolean;
	ignoreCasing?: boolean;
}

const defaultSortOptions: SortOptionsInterface = {
	onKey: '',
	descending: false,
	ignoreCasing: false
};

const sortList = <T>(list: T[], options: SortOptionsInterface = defaultSortOptions): T[] => {
	const listCopy = JSON.parse(JSON.stringify(list));

	listCopy.sort((itemA: any, itemB: any) => {
		if (isNumber(itemA) && isNumber(itemB)) {
			return options.descending ? (itemB - itemA) : (itemA - itemB);
		}

		let first = itemA;
		let second = itemB;

		if (options.onKey) {
			first = isObject(itemA) ? getObjectDeepKeyValue(options.onKey, itemA) : itemA;
			second = isObject(itemB) ? getObjectDeepKeyValue(options.onKey, itemB)  : itemB;
		}

		return first > second ? (options.descending ? -1 : 1) :
			first < second ? (options.descending ? 1 : -1) :
				0;
	});

	return listCopy;
};

export default sortList;
