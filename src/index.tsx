import React, {Fragment} from 'react';
// import {array} from 'prop-types';

interface Props {
	list: any[];
	renderItem: (item: any, idx: number) => any;
}

const FlatList = ({list, renderItem}: Props) => {
	return (
		<Fragment>
			{
				list.map((item, idx) => renderItem(item, idx))
			}
		</Fragment>
	);
};

export default FlatList;
