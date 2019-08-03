import React, {Fragment, FunctionComponent} from 'react';
import {array, func, oneOfType, string} from 'prop-types';
import filterList from './filter';

interface Props {
	list: any[];
	renderItem: (item: any, idx: number) => any;
	filterBy?: string | ((item: any, idx: number) => boolean);
}

const FlatList: FunctionComponent<Props> = ({list, renderItem, filterBy}) => {

	if (filterBy) {
		list = filterList(list, filterBy);
	}

	return (
		<Fragment>
			{
				list.map((item, idx) => renderItem(item, idx))
			}
		</Fragment>
	);
};

FlatList.propTypes = {
	list: array.isRequired,
	renderItem: func.isRequired,
	filterBy: oneOfType([func, string])
};

FlatList.defaultProps = {
	filterBy: ''
};

export default FlatList;
