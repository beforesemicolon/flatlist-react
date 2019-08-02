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

	if (!isObject(options) || Object.keys(options).length === 0) {
		options = defaultSortOptions;
	}

	options = {...defaultSortOptions, ...options};

	listCopy.sort((first: any, second: any) => {
		if (options.onKey) {
			first = isObject(first) ? getObjectDeepKeyValue(options.onKey, first) : first;
			second = isObject(second) ? getObjectDeepKeyValue(options.onKey, second) : second;
		}

		if (isNumber(first) && isNumber(second)) {
			return options!.descending ? (second - first) : (first - second);
		}

		return first > second ? (options.descending ? -1 : 1) :
			first < second ? (options.descending ? 1 : -1) :
				0;
	});

	return listCopy;
};

export default sortList;
