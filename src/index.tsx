import React, {Fragment, FunctionComponent} from 'react';
import {array, func, oneOfType, string, bool, node, element, number} from 'prop-types';
import filterList from './utils/filterList';
import sortList from './utils/sortList';
import groupList from './utils/groupList';
import {isString, isFunction} from './utils/isType';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			groupSeparator: any;
		}
	}
}

interface Props {
	list: any[];
	sortBy?: string;
	sortGroupBy?: string;
	sortDesc?: boolean;
	sortGroupDesc?: boolean;
	showGroupSeparatorAtTheBottom?: boolean;
	sort?: boolean;
	groupSeparator?: null | any;
	dontSortOnGroup?: boolean;
	ignoreCaseOnWhenSorting?: boolean;
	renderItem: (item: any, idx: number) => any;
	renderWhenEmpty?: null | (() => any);
	filterBy?: string | ((item: any, idx: number) => boolean);
	groupBy?: string | ((item: any, idx: number) => boolean);
	groupOf?: number;
}

const defaultBlank = (<p>List is empty...</p>);

const FlatList: FunctionComponent<Props> = (
	{
		list, renderItem, filterBy, groupBy, renderWhenEmpty, sortBy, sortDesc, sort, sortGroupBy, sortGroupDesc,
		ignoreCaseOnWhenSorting, groupSeparator, groupOf, showGroupSeparatorAtTheBottom
	}) => {
	const blank = renderWhenEmpty ? renderWhenEmpty() || defaultBlank : defaultBlank;

	if (filterBy) {
		list = filterList(list, filterBy);
	}

	if (sort || sortBy) {
		list = sortList(list, {
			onKey: sortBy,
			descending: sortDesc,
			ignoreCasing: ignoreCaseOnWhenSorting
		});
	}

	if (groupBy || groupOf) {
		return (
			<Fragment>
				{
					list.length > 0 ?
						groupList(list, {
							on: isFunction(groupBy) ? groupBy as any : null,
							by: isString(groupBy) ? groupBy as string : '',
							every: groupOf || 0
						}).reduce(((groupedList, group, idx) => {
							const separatorKey = `${idx}-${group.length}`;
							let separator = (<hr key={separatorKey}/>);

							if (groupSeparator) {
								separator = isFunction(groupSeparator) ? groupSeparator(group, idx) : groupSeparator;

								separator = (
									<separator.type {...separator.props} key={separatorKey} group={group} index={idx}/>
								);
							}

							if (sort || sortGroupBy) {
								group = sortList(group, {
									onKey: sortGroupBy,
									descending: sortGroupDesc,
									ignoreCasing: ignoreCaseOnWhenSorting
								});
							}

							if (showGroupSeparatorAtTheBottom) {
								return groupedList.concat(...group.map(renderItem), separator);
							}

							return groupedList.concat(separator, ...group.map(renderItem, ));
						}), []) :
						blank
				}
			</Fragment>
		);
	}

	return (
		<Fragment>
			{
				list.length > 0 ?
					list.map((item, idx) => renderItem(item, idx)) :
					blank
			}
		</Fragment>
	);
};

FlatList.propTypes = {
	list: array.isRequired,
	renderItem: func.isRequired,
	renderWhenEmpty: func,
	sortBy: string,
	sortDesc: bool,
	sortGroupDesc: bool,
	sort: bool,
	dontSortOnGroup: bool,
	sortGroupBy: string,
	showGroupSeparatorAtTheBottom: bool,
	groupOf: number,
	filterBy: oneOfType([func, string]),
	groupSeparator: oneOfType([node, func, element])
};

FlatList.defaultProps = {
	sortBy: '',
	sortGroupBy: '',
	filterBy: '',
	sortDesc: false,
	sortGroupDesc: false,
	showGroupSeparatorAtTheBottom: false,
	groupOf: 0,
	sort: false,
	ignoreCaseOnWhenSorting: false,
	renderWhenEmpty: null,
	groupSeparator: null
};

export default FlatList;
