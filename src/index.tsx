import React, {Fragment, FunctionComponent} from 'react';
import {array, func, oneOfType, string} from 'prop-types';
import filterList from './filter';

interface Props {
	list: any[];
	renderItem: (item: any, idx: number) => any;
	renderWhenEmpty?: null | (() => any);
	filterBy?: string | ((item: any, idx: number) => boolean);
}

const defaultBlank = (<p>List is empty...</p>);

const FlatList: FunctionComponent<Props> = ({list, renderItem, filterBy, renderWhenEmpty}) => {

	if (filterBy) {
		list = filterList(list, filterBy);
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
	filterBy: oneOfType([func, string])
};

FlatList.defaultProps = {
	filterBy: '',
	renderWhenEmpty: null
};

export default FlatList;
