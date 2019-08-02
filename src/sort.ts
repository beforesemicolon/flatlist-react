import {isNumber} from './isType';

export interface SortOptionsInterface {
	onKeys?: string;
	descending?: boolean;
	ignoreCasing?: boolean;
}

const defaultSortOptions: SortOptionsInterface = {
	onKeys: '',
	descending: false,
	ignoreCasing: false
};

const sortList = <T>(list: T[], options: SortOptionsInterface = defaultSortOptions): T[] => {
	const listCopy = JSON.parse(JSON.stringify(list));

	listCopy.sort((itemA: any, itemB: any) => {
		if (isNumber(itemA) && isNumber(itemB)) {
			return options.descending ? (itemB - itemA) : (itemA - itemB);
		}

		return itemA > itemB ? (options.descending ? -1 : 1) :
			itemA < itemB ? (options.descending ? 1 : -1) :
				0;
	});

	return listCopy;
};

export default sortList;
