import React, {Fragment, FunctionComponent} from 'react';
import {array, func, oneOfType, string, bool} from 'prop-types';
import filterList from './filter';
import sortList from './sort';

interface Props {
	list: any[];
	sortBy?: string;
	sortDesc?: boolean;
	sort?: boolean;
	ignoreCaseOnWhenSorting?: boolean;
	renderItem: (item: any, idx: number) => any;
	renderWhenEmpty?: null | (() => any);
	filterBy?: string | ((item: any, idx: number) => boolean);
}

const defaultBlank = (<p>List is empty...</p>);

const FlatList: FunctionComponent<Props> = ({
	list,
	renderItem,
	filterBy,
	renderWhenEmpty,
	sortBy,
	sortDesc,
	sort,
	ignoreCaseOnWhenSorting
	}) => {

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

	return (
		<Fragment>
			{
				list.length > 0 ?
					list.map((item, idx) => renderItem(item, idx)) :
					renderWhenEmpty ? renderWhenEmpty() || defaultBlank : defaultBlank
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
	sort: bool,
	ignoreCaseOnWhenSorting: bool,
	filterBy: oneOfType([func, string])
};

FlatList.defaultProps = {
	sortBy: '',
	filterBy: '',
	sortDesc: false,
	sort: false,
	ignoreCaseOnWhenSorting: false,
	renderWhenEmpty: null
};

export default FlatList;
