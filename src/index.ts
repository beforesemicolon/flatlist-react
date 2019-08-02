import sortList from './sort';

const list1 = ['kd', 'ak', '0p', 'Bs', 'Ad', '_3j', 'bA', 'J_k', 'A@', '__b', '__C'];
const list2 = [4, 6, 1, 7, 9, 30, 10, 29, -2, 3.1, -34, 0, 92, 12];
const list3 = [
	{firstName: 'Elson', lastName: 'Correia'},
	{firstName: 'Agdar', lastName: 'Morreia'},
	{firstName: 'Kelso', lastName: 'Lopes'},
	{firstName: 'Ector', lastName: 'Alejandro'},
	{firstName: 'Bob', lastName: 'Ray'},
	{firstName: 'Octavio', lastName: 'Aguiar'}
	];
const list4 = []; // sets | weakSets
const list5 = []; // maps | weakMaps
const list6 = []; // symbols
const list7 = []; // mix of all

console.log('-- list 1', sortList(list1, {descending: true}));
console.log('-- list 2', sortList(list2, {descending: true}));
// console.log('-- list 3', sortList(list3));
