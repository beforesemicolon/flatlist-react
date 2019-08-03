import {isNumber, isObject, isFunction, isString} from './utils/isType';
import getObjectDeepKeyValue from './utils/getObjectDeepKeyValue';

export interface GroupOptionsInterface {
	by?: string;
	on?: ((item: any, idx: number) => string) | null;
	every?: number;
}

const defaultGroupOptions: GroupOptionsInterface = {
	by: '',
	on: null,
	every: 0
};

const groupList = <T>(list: T[], options: GroupOptionsInterface = defaultGroupOptions) => {

	if (!isObject(options) || Object.keys(options).length === 0) {
		options = defaultGroupOptions;
	}

	options = {...defaultGroupOptions, ...options};

	interface GroupedItemsObjectInterface {
		[s: string]: T[];
	}

	if (options.by && isString(options.by)) {
		const groupedList: GroupedItemsObjectInterface = list
			.reduce((prevList: GroupedItemsObjectInterface, item: T): GroupedItemsObjectInterface => {
				// @ts-ignore
				const groupLabel: string = getObjectDeepKeyValue(options.by, item);

				if (!prevList[groupLabel]) {
					prevList[groupLabel] = [];
				}

				prevList[groupLabel].push(item);

				return prevList;
			}, {});

		return Object.values(groupedList);
	}

	if (options.on && isFunction(options.on)) {
		const groupedList: GroupedItemsObjectInterface = list
			.reduce((prevList: GroupedItemsObjectInterface, item: T, idx: number): GroupedItemsObjectInterface => {
				// @ts-ignore
				const groupLabel: string = options.on(item, idx);

				if (!prevList[groupLabel]) {
					prevList[groupLabel] = [];
				}

				prevList[groupLabel].push(item);

				return prevList;
			}, {});

		return Object.values(groupedList);
	}

	// @ts-ignore
	if (isNumber(options.every) && (options.every > 0)) {
		return list.reduce((groupedList: any[], item: T, idx: number) => {
			groupedList[groupedList.length - 1].push(item);

			const itemNumber: number = idx + 1;
			// @ts-ignore
			if (isNumber(options.every) && (options.every > 0) &&
				itemNumber < list.length && // make sure separator is not added at the end
				// @ts-ignore
				(itemNumber % options.every) === 0
			) {
				groupedList.push([]);
			}

			return groupedList;
		}, [[]]);
	}

	return list;
};

export default groupList;