import searchList from '../../src/___utils/searchList';

describe('Util: searchList()', () => {
   describe('Non Primitive Array', () => {
       const objectArrays = [{name: 'Last'}, {name: 'First'}, {name: 'First middle'}, {name: 'Last back'}];

       it('Should search on specified provided string "by" with/without options', () => {
           expect.assertions(16);

           const search = (term: string, caseInsensitive: boolean, everyWord: boolean) =>
               searchList(objectArrays, {
                   by: 'name',
                   caseInsensitive,
                   everyWord,
                   term
               });

           expect(search('first', false, false)).toHaveLength(0);
           expect(search('first', false, false)).toEqual([]);

           expect(search('first', true, false)).toHaveLength(2);
           expect(search('first', true, false))
               .toEqual([{name: 'First'}, {name: 'First middle'}]);

           expect(search('first', true, true)).toHaveLength(2);
           expect(search('first', true, true))
               .toEqual([{name: 'First'}, {name: 'First middle'}]);

           expect(search('first', false, true)).toHaveLength(0);
           expect(search('first', false, true)).toEqual([]);

           expect(search('first Mid Back', false, false)).toHaveLength(0);
           expect(search('first Mid Back', false, false)).toEqual([]);

           expect(search('first Mid Back', true, false)).toHaveLength(0);
           expect(search('first Mid Back', true, false)).toEqual([]);

           expect(search('first Mid Back', true, true)).toHaveLength(3);
           expect(search('first Mid Back', true, true))
               .toEqual([{name: 'First'}, {name: 'First middle'}, {name: 'Last back'}]);

           expect(search('first Mid Back', false, true)).toHaveLength(0);
           expect(search('first Mid Back', false, true)).toEqual([]);
       });

       it('Should search using function "by" with/without options', () => {
           // expect.assertions(8);

           const search = (term: string, caseInsensitive: boolean, everyWord: boolean) =>
               searchList(objectArrays, {
                   by: (item, searchTerm: string) =>
                       (caseInsensitive ? item.name.toLowerCase() : item.name).search(searchTerm) >= 0,
                   caseInsensitive,
                   everyWord,
                   term
               });

           expect(search('first', false, false)).toHaveLength(0);
           expect(search('first', false, false)).toEqual([]);

           expect(search('first', true, false)).toHaveLength(2);
           expect(search('first', true, false))
               .toEqual([{name: 'First'}, {name: 'First middle'}]);

           expect(search('first', true, true)).toHaveLength(2);
           expect(search('first', true, true))
               .toEqual([{name: 'First'}, {name: 'First middle'}]);

           expect(search('first', false, true)).toHaveLength(0);
           expect(search('first', false, true)).toEqual([]);

           expect(search('first Mid Back', false, false)).toHaveLength(0);
           expect(search('first Mid Back', false, false)).toEqual([]);

           expect(search('first Mid Back', true, false)).toHaveLength(0);
           expect(search('first Mid Back', true, false)).toEqual([]);

           expect(search('first Mid Back', true, true)).toHaveLength(3);
           expect(search('first Mid Back', true, true))
               .toEqual([{name: 'First'}, {name: 'First middle'}, {name: 'Last back'}]);

           expect(search('first Mid Back', false, true)).toHaveLength(0);
           expect(search('first Mid Back', false, true)).toEqual([]);
       });

       describe('multiple key search', () => {
           const objectArray = [
               {name: 'Last', other: 'Zer'},
               {name: 'First', other: 'Last'},
               {name: 'Middle', other: 'Zer'},
               {name: 'First', other: 'Middle'},
               {name: 'Last', other: 'Abo'}
           ];

           it('Should search on "name" and "other" keys', () => {
               expect(searchList(objectArray, {
                   by: ['name', 'other'],
                   term: 'Last',
                   everyWord: false,
                   caseInsensitive: false
               })).toEqual([
                   {name: 'Last', other: 'Zer'},
                   {name: 'First', other: 'Last'},
                   {name: 'Last', other: 'Abo'}
               ]);

               expect(searchList(objectArray, {
                   by: ['name', 'other'],
                   term: 'last',
                   everyWord: false,
                   caseInsensitive: true
               })).toEqual([
                   {name: 'Last', other: 'Zer'},
                   {name: 'First', other: 'Last'},
                   {name: 'Last', other: 'Abo'}
               ]);

               expect(searchList(objectArray, {
                   by: ['name', 'other'],
                   term: 'last',
                   everyWord: false,
                   caseInsensitive: false
               })).toEqual([]);

               expect(searchList(objectArray, {
                   by: ['name', {by: 'other', caseInsensitive: true}],
                   term: 'last',
                   everyWord: false,
                   caseInsensitive: false
               })).toEqual([
                   {name: 'First', other: 'Last'},
               ]);

               expect(searchList(objectArray, {
                   by: ['name', {by: 'other', caseInsensitive: true}],
                   term: 'zer last',
                   everyWord: true,
                   caseInsensitive: false
               })).toEqual([
                   {name: 'Last', other: 'Zer'},
                   {name: 'First', other: 'Last'},
                   {name: 'Middle', other: 'Zer'},
               ]);
           });
       })
   });

   describe('Primitive array', () => {
       const stringArrays = ['Last', 'First', 'First middle', 'Last back'];

       it('Should search without "by" with/without options', () => {
           expect.assertions(16);

           const search = (term: string, caseInsensitive: boolean, everyWord: boolean) =>
               searchList(stringArrays, {
                   caseInsensitive,
                   everyWord,
                   term
               });

           expect(search('first', false, false)).toHaveLength(0);
           expect(search('first', false, false)).toEqual([]);

           expect(search('first', true, false)).toHaveLength(2);
           expect(search('first', true, false))
               .toEqual(['First', 'First middle']);

           expect(search('first', true, true)).toHaveLength(2);
           expect(search('first', true, true))
               .toEqual(['First', 'First middle']);

           expect(search('first', false, true)).toHaveLength(0);
           expect(search('first', false, true)).toEqual([]);

           expect(search('first Mid Back', false, false)).toHaveLength(0);
           expect(search('first Mid Back', false, false)).toEqual([]);

           expect(search('first Mid Back', true, false)).toHaveLength(0);
           expect(search('first Mid Back', true, false)).toEqual([]);

           expect(search('first Mid Back', true, true)).toHaveLength(3);
           expect(search('first Mid Back', true, true))
               .toEqual(['First', 'First middle', 'Last back']);

           expect(search('first Mid Back', false, true)).toHaveLength(0);
           expect(search('first Mid Back', false, true)).toEqual([]);
       });
   })
});
