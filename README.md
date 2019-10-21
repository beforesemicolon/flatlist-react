# FlatList React

A helpful utility component to handle lists in react like a champ. It handles filtering, sorting,
grouping, searching, styling and more.

## Table of Content
- [Table of Content](https://github.com/ECorreia45/flatlist-react/tree/documentation#table-of-content)
- [Installing](https://github.com/ECorreia45/flatlist-react/tree/documentation#installing)
- [Documentation (How to use it)](https://github.com/ECorreia45/flatlist-react/tree/documentation#documentation-how-to-use-it)
    * [Rendering list](https://github.com/ECorreia45/flatlist-react/tree/documentation#rendering-list)
        * [list prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#list-prop)
        * [renderItem prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#renderitem-prop)
        * [wrapperHtmlTag prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#wrapperhtmltag-prop)
        * [renderWhenEmpty prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#renderwhenempty-prop)
        * [limit prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#limit-prop)
        * [reversed prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#reversed-prop)
    * [Dot Notation for string](https://github.com/ECorreia45/flatlist-react/tree/documentation#dot-notation-for-string)
    * [Filtering Items](https://github.com/ECorreia45/flatlist-react/tree/documentation#filteringsearching-items)
        * [filterBy prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#filterby-prop)
    * [Searching Items](https://github.com/ECorreia45/flatlist-react/tree/documentation#searching-items)
        * [searchTerm prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#searchterm-prop)
        * [searchBy prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#searchby-prop)
            * [Searching on multiple keys](https://github.com/ECorreia45/flatlist-react/tree/documentation#searching-on-multiple-keys)
        * [searchCaseInsensitive prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#searchcaseinsensitive-prop)
        * [searchOnEveryWord prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#searchoneveryword-prop)
        * [search prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#search-prop)
    * [Sorting Items](https://github.com/ECorreia45/flatlist-react/tree/documentation#sorting-items)
        * [sort prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sort-prop)
        * [sortBy prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortby-prop)
        * [sortDesc prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortdesc-prop)
        * [sortGroupBy prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortgroupdesc-prop)
        * [sortGroupDesc prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortgroupdesc-prop)
        * [sortCaseInsensitive prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortcaseinsensitive-prop)
    * [Grouping Items](https://github.com/ECorreia45/flatlist-react/tree/documentation#grouping-items)
        * [groupReversed prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupreversed-prop)
        * [groupBy prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupby-prop)
        * [groupOf prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupof-prop)
        * [Custom Group Separator](https://github.com/ECorreia45/flatlist-react/tree/documentation#custom-group-separator)
        * [groupSeparator prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupseparator-prop)
        * [showGroupSeparatorAtTheBottom prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#showgroupseparatoratthebottom-prop)
        * [group prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#group-prop)
    * [Styling (Grid and Row)](https://github.com/ECorreia45/flatlist-react/tree/documentation#styling-grid-and-row)
        * [displayGrid prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#displaygrid-prop)
        * [gridGap prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#gridgap-prop)
        * [minColumnWidth prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#mincolumnwidth-prop)
        * [displayRow prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#displaygrid-row)
        * [rowGap prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#rowgap-prop)
        * [display prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#display-prop)
- [Author](https://github.com/ECorreia45/flatlist-react/tree/documentation#author)

## Installing

This is a react utility component and that means it will only work on your react project/environment. 

In your React project run the following command:

```npm install flatlist-react```

## Documentation (How to use it)

This utility component was built with ease of use in mind so please report or contribute anything that could be
improved in later releases.

Please feel free to suggest features as well by getting in touch with **Elson Correia**.

#### Rendering list

The component has two required props, `list` and `renderItem`.

We will use the following object as an example for this documentation. This will be the list we will pass to it.

```js
people = [
    {firstName: 'Elson', lastName: 'Correia', info: {age: 24}},
    {firstName: 'John', lastName: 'Doe', info: {age: 18}},
    {firstName: 'Jane', lastName: 'Doe', info: {age: 34}},
    {firstName: 'Maria', lastName: 'Carvalho', info: {age: 22}},
    {firstName: 'Kelly', lastName: 'Correia', info:{age: 23}},
    {firstName: 'Don', lastName: 'Quichote', info: {age: 39}},
    {firstName: 'Marcus', lastName: 'Correia', info: {age: 0}},
    {firstName: 'Bruno', lastName: 'Gonzales', info: {age: 25}},
    {firstName: 'Alonzo', lastName: 'Correia', info: {age: 44}}
  ]
```

Now inside your component file, we create a function `renderPerson` that will be passed to `renderItem`:

```jsx
import FlatList from 'flatlist-react';

...

renderPerson = (person, idx) => {
  return (
      <li key={`${person.firstName}-${idx}`}>
        <b>{person.firstName} {person.lastName}</b> (<span>{person.info.age}</span>)
      </li>
  );
}


return (
    <ul>
        <FlatList list={this.props.people} renderItem={this.renderPerson}/>
    </ul>
)

```
##### list prop
`list` should be an array or object. `Object`s,`Set`s and `Map`s will be translated to an array of their values where
`WeakMap`s and `WeakSet`s will always be an empty array.

The list can be empty as long as it is an empty array or object.

##### renderItem prop
`renderItem` prop takes a function that should return a component or a component itself like `renderItem={<ItemComponent/>}`. 
If you pass a function, it will be called for every item on the list with the item as the first argument and index of 
the item as second argument. Use this function to do everything related to rendering the item component.
If you pass a component, it will render it for every item in the `list` and injecting `item` prop will be injected into 
it and you can use that to access the item.

In our example above we are simply returning a `li` tag with person's full name and age using function for renderItem. 
The same can be done as:

```jsx

const Person = ({item}) => ( 
  <li>
    <b>{item.firstName} {item.lastName}</b> (<span>{item.info.age}</span>)
  </li>
)

...

return (
    <ul>
        <FlatList list={this.props.people} renderItem={<Person/>}/>
    </ul>
)

```

##### wrapperHtmlTag prop
By default, your list items will not be wrapped in any `HTML` tag but if you want to specify a wrapper tag you can use
`wrapperHtmlTag` which will allow you to treat `FlatList` as an `HTML` tag and set any attribute a html tag can support.

For example:

```jsx
listRef = createRef();

return (
    <ul class="list-items" ref={this.listRef} onMouseOver={this.handleMouseOver}>
        <FlatList list={this.props.people} renderItem={<Person/>}/>
    </ul>
)
```

The above can also be written as:

```jsx
listRef = createRef();

return (
    <FlatList list={this.props.people} renderItem={<Person/>} wrapperHtmlTag="ul"
              class="list-items" ref={this.listRef} onMouseOver={this.handleMouseOver}/>
)
```

##### renderWhenEmpty prop

You are required to pass an array/object to the `list` prop, it does not mean the array/object needs to contain anything. 
Because when doing so nothing will be displayed, there is another prop called `renderWhenEmpty` that you can use to tell the
component what to display when list has no items. This is ideal for blanks, telling the user the filtering or search 
ended up leaving the list empty.

`renderWhenEmpty` must be a function that returns a component. The function is not called with any argument.

```jsx
...

renderBlank = () => {
    return <p>Nothing to display yet...</p>;
}

...

return (
    <ul>
        <FlatList 
            list={this.props.people} 
            renderItem={this.renderPerson}
            renderWhenEmpty={this.renderBlank}
            />
    </ul>
)
```
In the above example `renderWhenEmpty` is taking a function that simply returns a `<p/>` saying `"Nothing to display yet..."`.
Function here can be useful in cases you have different blank message to show, for example, if user typed a search
keyword you could check that and say `"Nothing matched your search"` or if the user applied a filter you can show another
one saying `"Nothing matched your filtering criteria"`. We will see those examples when we reach filtering session on
this documentation.

##### limit prop
This prop will make sure that the number of items to render is up to a number you indicate here. There is also 
[groupOf](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupof-prop) 
if you want to limit the size of the groups.

##### reversed prop
This simply reverse the provided list. Instead of reading the list from first to last item it will do the reverse. There is also 
[groupReversed](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupreversed-prop) 
if you want the same effect on the individual groups.

### Note

```
Reversing a list or group will happen before any sorting. If you don't see the effect of your reverse is because
your sorting order will overwrite the reversing of the list or groups. When sorting, the list or groups will still be 
read in reverse order but the output may not match the reverse result. If you think that reverting the list might make
the sorting faster, it is a great combo of props to use.
```

#### Dot Notation for string
The FlatList component takes some props like `filterBy`, `sortBy` and `groupBy` which can be strings and you can use
[Dot Notation for string](https://github.com/ECorreia45/flatlist-react/tree/documentation#dot-notation-for-string)
to deep match a key in an object. for example, I can pass `info.age` to group or sort our list of people by
age. If i had an array of children in info i could say `info.children.0.age` where `0`(zero) is the index of the array.

This is to make it easy to reach deep into your objects without having to change them to work with filtering, sorting or
grouping. All these props also take functions for power, read more below.

#### Filtering Items
To filter the list you can use the `filterBy` prop which narrows down your list to be more specific.

##### filterBy prop
`filterBy` can be a string or a function. The function must return true or false where false means the item will be 
not displayed. The function is called with two arguments, the item and its index. If you pass a string, you can use 
[Dot Notation for string](https://github.com/ECorreia45/flatlist-react/tree/documentation#dot-notation-for-string). 

```jsx
...

return (
    <ul>
        <FlatList 
            list={this.props.people} 
            renderItem={this.renderPerson}
            filterBy="info.age"
            />
    </ul>
)
```
The above filter will only remove `Marcus Correia` from the view since his age is zero and `filterBy` will check for
`truthy`, `falsy` values in that key. 

For more power we can use a function to include only people above 20 years old and lastName is Correia like this.

```jsx
handleFilter = (person, index) => {
    return person.info.age >= 20 && person.lastName === 'Correia';
}
...

return (
    <ul>
        <FlatList 
            list={this.props.people} 
            renderItem={this.renderPerson}
            filterBy={this.handleFilter}
            />
    </ul>
)
```

#### Searching Items
FlatList allows you to search the list with full control on your search using the props `searchTerm`, `searchBy`,
`searchCaseInsensitive` and `searchOnEveryWord`. You can also use the short-hand version by simply using the
[`search` prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#search-prop). The search prop will 
allow to pass an object with search configuration.

##### searchTerm prop
The `searchTerm` prop is your way of telling FlatList that you want it to handle the search. This prop by itself does
not do anything. To initialize the search functionality you need to also provide the `searchBy` prop.

### Note

```
SearchTerm must be at least 3 characters long to trigger a search. If searchOnEveryWord prop is specified, same rule
applies to every word. Each word should be at least 3 characters long to be considered.
```

##### searchBy prop
The `searchBy` can be either a string or a function. Similar to 
[`filterBy`](https://github.com/ECorreia45/flatlist-react/tree/documentation#filterby-prop) the function must return 
true or false where false means the item will not be displayed. The function is called with two arguments, 
the item and its index. If you pass a string know that it should represent the key you want to search on. You can use
[Dot Notation for string](https://github.com/ECorreia45/flatlist-react/tree/documentation#dot-notation-for-string) here.

```jsx
state = {
    searchTerm: ''
}

handleSearchInput = (event) => {
    this.setState({searchTerm: event.target.value});
}

...

return (
    <>
        <input value={this.state.searchTerm} onChange={this.handleSearchInput}/>
        <ul>
            <FlatList 
                list={this.props.people}
                renderItem={this.renderPerson}
                searchTerm={this.state.searchTerm}
                searchBy="firstName"
                />
        </ul>
    </>
)
```
###### Searching on multiple keys
For now if you want to search on multiple keys you need to use `searchBy` as function. The function is called with the 
item, the term (if `searchOnEveryWord` is off) or the word (if `searchOnEveryWord` is on). To have case insensitive 
functionality you need to `toLowerCase()` each key value. You can have a function like this to pass it to:

```jsx
matchSearchTerm = (person, term, idx) => {
    return person.firstName.toLowerCase().search(term) >= 0 || person.lastName.toLowerCase().search(term) >= 0;
}
```

##### searchOnEveryWord prop
This prop will allow you to look into every word type to find a match. By default the whole `searchTerm` is used to find
a match. For example `person in blue` will not match `people in blue` but with the `searchOnEveryWord` prop it will
because it will try to find `person` and not find then try `blue` which will match.

##### searchCaseInsensitive prop
This prop will make sure that no matter the casing of the `searchTerm` it will try to find a match. So words like 
`people` and `People` will match each other.

##### search prop
The `search` prop allows you to do pass an object configuration for search containing the following options:
* `term` (same as [searchTerm prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#searchterm-prop))
* `by` (same as [searchBy prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#searchby-prop))
* `caseInsensitive` (same as [searchCaseInsensitive prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#searchcaseinsensitive-prop))
* `everyWord` (same as [searchOnEveryWord prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#searchoneveryword-prop))

#### Sorting Items
There are two ways to sort the list. You can sort the entire list by using props `sort` and `sortBy` or sort the groups
by using prop `sortGroupBy`. You also can control the direction of the sort by using props `sortDesc` and `sortGroupDesc`.
By default, everything is sorted ascending.

##### sort prop
`sort` prop simple tells FlatList to sort items and this works great for list that contains **string** or **numbers**.
It has no effect on list of **arrays** or **objects**.

Below example will sort the numbers from -1(negative one) to 7(seven):

```jsx
...

return (
    <ul>
        <FlatList 
            list={[3, 7, -1, 2, 0]} 
            renderItem={(number, index) => <li><b>{index + 1}</b> - {number}</li>}
            sort
            />
    </ul>
)
```

The `sort` prop is also a shorthand for all sorting related props, meaning it allows you to do pass an object 
configuration for sorting containing the following options:
* `by` (same as [sortBy prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortby-prop))
* `descending` (same as [sortDesc prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortdesc-prop))
* `caseInsensitive` (same as [sortCaseInsensitive prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortcaseinsensitive-prop))
* `groupBy` (same as [sortGroupBy prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortgroupby-prop))
* `groupDescending` (same as [sortGroupDesc prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortgroupdesc-prop))
* `groupCaseInsensitive` (same as [sortCaseInsensitive prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortcaseinsensitive-prop))

##### sortBy prop
`sortBy` should be a string representing the key of the **object** or **array** and can use 
[Dot Notation for string](https://github.com/ECorreia45/flatlist-react/tree/documentation#dot-notation-for-string). 
This is great when the lists that are not made of **string** or **numbers**.

##### sortDesc prop
`sortDesc` will affect the whole list and changes sorting from ascending to descending.

```jsx
...

return (
    <ul>
        <FlatList 
            list={this.props.people} 
            renderItem={this.renderPerson}
            sortBy="info.age"
            sortDesc
            />
    </ul>
)
```

##### sortGroupBy prop
`sortGroupBy` is the equivalent of `sortBy` but for groups. It helps you use a different sorting criteria withing the
group.

##### sortGroupDesc prop
`sortGroupDesc` is similar to `sortDesc` but will only affect groups. This should be used along with grouping props.

##### sortCaseInsensitive prop
`sortCaseInsensitive` is another sorting control that simply forces FlatList to ignore casing. This is great for 
when you don't care about exact match on casing and can be used with searching.

#### Grouping Items
Grouping is a powerful feature and by default FlatList will add a `<hr/>` in between groups but you can override this
as well by using `groupSeparator` props. You can control list grouping with props `groupBy` and `groupOf`.

##### groupReversed prop
`groupReversed` will have the save effect as `reversed` but on a group level. It will read/display your group in reversed
order unless there is some group level sorting. Any group level sorting will overwrite reversing.

##### groupBy prop
`groupBy` can either be a string using 
[Dot Notation for string](https://github.com/ECorreia45/flatlist-react/tree/documentation#dot-notation-for-string) 
or a function for more control. The function will be called with
two arguments, the item and its index on the list and should return a string to identify the group.


The example below will group everybody with same last name.

```jsx
...

return (
    <ul>
        <FlatList 
            list={this.props.people} 
            renderItem={this.renderPerson}
            groupBy="lastName"
            />
    </ul>
)
```
The example below will create two groups, one for those under 30(thirty) and another for those over 30(thirty)
```jsx
...

return (
    <ul>
        <FlatList 
            list={this.props.people} 
            renderItem={this.renderPerson}
            groupBy={(item, index) => item.info.age > 30 ? 'over' : 'under' }
            />
    </ul>
)
```

##### groupOf prop
`groupOf` prop is a simple one and it takes a number. This is great when you want to make groups of certain count of
items.
The example below will create three groups containing three members each.
```jsx
...

return (
    <ul>
        <FlatList 
            list={this.props.people} 
            renderItem={this.renderPerson}
            groupOf={3}
            />
    </ul>
)
```

All the group examples so far render separated by a `<hr/>` in the DOM and it should be nice to provide a label so we
know whats going on and for that we should look into our custom group separator on the next session.

##### Custom Group Separator
To create your own group separator you should use `groupSeparator` prop and If you don't want any separator at all you
can simply pass `null` like this `groupSeparator={null}`. 

##### groupSeparator prop
`groupSeparator` should be a element or a function that returns an element. When you use a function, the function is
called with the group array and the index of the group. 

##### showGroupSeparatorAtTheBottom prop
By default, group separators show up at the top of each group on the DOM. To change that use `showGroupSeparatorAtTheBottom`
flag to make it appear on the bottom of the groups.

The example below will create two groups, one for those under 30(thirty) and another for those over 30(thirty) in
descending order and it will also render the label to identify each group by using the third paramater passed to 
`groupSeparator` callback.
```jsx
...

return (
    <ul>
        <FlatList 
            list={this.props.people} 
            renderItem={this.renderPerson}
            groupBy={(person, index) => person.info.age > 30 ? 'Over' : 'Under' }
            sortDesc
            sortGroupDesc
            groupSeparator={(group, index, groupLabel) => (<h3>{groupLabel}</h3>)}
            />
    </ul>
)
```

##### group prop
The `group` prop allows you to do pass an object configuration for grouping containing the following options:
* `by` (same as [groupBy prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupby-prop))
* `limit` (same as [groupOf prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupof-prop))
* `reversed` (same as [groupReversed prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupreversed-prop))
* `separator`: (same as [groupSeparator prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupseparator-prop))
* `separatorAtTheBottom` (same as [showGroupSeparatorAtTheBottom prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#showgroupseparatoratthebottom-prop))
* `sortBy` (same as [sortGroupBy prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortgroupby-prop))
* `sortDescending` (same as [sortGroupDesc prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortgroupdesc-prop))
* `sortCaseInsensitive` (same as [sortCaseInsensitive prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#sortcaseinsensitive-prop))

#### Styling (Grid and Row)
The component also lets you style how the list is display and you have 2(two) options, display everything in a 
grid layout or rows like a table. By default no styling is applied and once you choose to go with these, some of your
style may get overwritten.

##### displayGrid prop
`displayGrid` will turn your items container into a grid container and your items in grid items. By default every item
will be spaced `20px` from each other with column width of `200px`. You can override these as you want as well. The 
container will become responsive and adapt with browser resizing adjusting every item on the list.

##### gridGap prop
`gridGap` prop takes a string and allows you to determine how far apart the items stay from each other. This is the same as 
[CSS grid-gap](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)
and you have to specify the unit, for example: `35px 10px`, `1vw`, `5% 20px`'

##### minColumnWidth prop
`minColumnWidth` prop takes a string and allows you to control the column minimum width when adapting to resizing. You
must specify the unit, for example: `300px`, `20%`, `15vw`.

##### displayRow prop
`displayRow` will make the items and items container full width adding `20px` between items. You can override these 
as you want as well.

##### rowGap prop
`rowGap` prop takes a string and allows you to control the spacing between items. The spacing is added to the bottom of
every item. You must specify the unit, for example: `30px`, `1vh`.

##### display prop
The `display` prop allows you to do pass an object configuration for styling containing the following options:* `
* `row`  (same as [displayRow prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupby-prop))
* `rowGap`  (same as [rowGap prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupby-prop))
* `grid` (same as [displayGrid prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupby-prop))
* `gridGap` (same as [gridGap prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupby-prop))
* `gridMinColumnWidth` (same as [minColumnWidth prop](https://github.com/ECorreia45/flatlist-react/tree/documentation#groupby-prop))

### Note

```
Styling will only affect position and size of the items, you can choose to style your items however you like.
```

## Author

[Elson Correia Portfolio](https://elsoncorreia.com/)

