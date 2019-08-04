# FlatList React

A helpful utility component to handle lists in react like a champ. It handles filtering, sorting,
grouping, searching, styling and more.

## Table of Content
- [Table of Content](https://github.com/ECorreia45/flatlist-react/tree/main#table-of-content)
- [Installing](https://github.com/ECorreia45/flatlist-react/tree/main#installing)
- [Documentation (How to use it)](https://github.com/ECorreia45/flatlist-react/tree/main#documentation-how-to-use-it)
    * [Rendering list](https://github.com/ECorreia45/flatlist-react/tree/main#rendering-list)
        * [list prop](https://github.com/ECorreia45/flatlist-react/tree/main#list-prop)
        * [renderItem prop](https://github.com/ECorreia45/flatlist-react/tree/main#renderitem-prop)
        * [renderWhenEmpty prop](https://github.com/ECorreia45/flatlist-react/tree/main#render-when-list-is-empty)
    * [Dot Notation for string](https://github.com/ECorreia45/flatlist-react/tree/main#dot-notation-for-string)
    * [Filtering/Searching Items](https://github.com/ECorreia45/flatlist-react/tree/main#filteringsearching-items)
        * [filterBy prop](https://github.com/ECorreia45/flatlist-react/tree/main#filterby-prop)
        * [searching](https://github.com/ECorreia45/flatlist-react/tree/main#searching)
    * [Sorting Items](https://github.com/ECorreia45/flatlist-react/tree/main#sorting-items)
        * [sort prop](https://github.com/ECorreia45/flatlist-react/tree/main#sort-prop)
        * [sortBy prop](https://github.com/ECorreia45/flatlist-react/tree/main#sortby-prop)
        * [sortDesc prop](https://github.com/ECorreia45/flatlist-react/tree/main#sortdesc-prop)
        * [sortGroupDesc prop](https://github.com/ECorreia45/flatlist-react/tree/main#sortgroupdesc-prop)
        * [ignoreCaseOnWhenSorting prop](https://github.com/ECorreia45/flatlist-react/tree/main#ignorecaseonwhensorting-prop)
    * [Grouping Items](https://github.com/ECorreia45/flatlist-react/tree/main#grouping-items)
        * [groupBy prop](https://github.com/ECorreia45/flatlist-react/tree/main#groupby-prop)
        * [groupOf prop](https://github.com/ECorreia45/flatlist-react/tree/main#groupof-prop)
        * [Custom Group Separator](https://github.com/ECorreia45/flatlist-react/tree/main#custom-group-separator)
        * [groupSeparator prop](https://github.com/ECorreia45/flatlist-react/tree/main#groupseparator-prop)
        * [showGroupSeparatorAtTheBottom prop](https://github.com/ECorreia45/flatlist-react/tree/main#showgroupseparatoratthebottom-prop)
    * [Styling (Grid and Row)](https://github.com/ECorreia45/flatlist-react/tree/main#styling-grid-and-row)
        * [displayGrid prop](https://github.com/ECorreia45/flatlist-react/tree/main#displaygrid-prop)
        * [gridGap prop](https://github.com/ECorreia45/flatlist-react/tree/main#gridgap-prop)
        * [minColumnWidth prop](https://github.com/ECorreia45/flatlist-react/tree/main#mincolumnwidth-prop)
        * [displayRow prop](https://github.com/ECorreia45/flatlist-react/tree/main#displaygrid-row)
        * [rowGap prop](https://github.com/ECorreia45/flatlist-react/tree/main#rowgap-prop)
- [Author](https://github.com/ECorreia45/flatlist-react/tree/main#author)

## Installing

This is a react utility component and that means it will only work on your react project/environment. 

In your React project run following command:

```npm install flatlist-react```

## Documentation (How to use it)

This utility component was built with ease of use in mind so please report or contribute anything that could be
improved in later releases.

Please feel free to suggest features as well by getting in touch with **Elson Correia**.

#### Rendering list

The component has two required props, `list` and `renderItem`.

We will use the following object as an example for this documentation. This will be the list we will pass to it.

```
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

```
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
`list` should be an array of **strings**, **numbers**, **arrays** or **objects**. 
Other things like **Set**, **WeakSets**, **Map**, **WeakMaps** and others are not yet supported.

The list can be empty as long as it is an empty array.

##### renderItem prop
`renderItem` prop takes a function that should return a component. The function will be called for every item on the
list with the item as the first argument and index of the item as second argument. Use this function to do everything
related to rendering the item component.

In our example above we are simply returning a `li` tag with person's full name and age.

### Note

```
FlatList will not wrap the list items in any html component. Expect your items to be direct 
child of their parent container element. 

In the example above, <li/> will show up directly under <ul/> in the DOM.
```


##### Render When List is Empty

You are required to pass an array to the `list` prop, it does not mean the array needs to contain anything. Because
when doing so nothing will be displayed, there is another prop called `renderWhenEmpty` that you can use to tell the
component what to display when no item is displaying. This is ideal for blanks, telling the user their filtering matched
no item.

##### renderWhenEmpty prop
`renderWhenEmpty` can be a component or a function that returns a component. The function is 
not called with any argument.

```
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

#### Dot Notation for string
The FlatList component takes some props like `filterBy`, `sortBy` and `groupBy` which can be strings and you can use
dot notation to deep match a key in an object. for example, I can pass `info.age` to group or sort our list of people by
age. If i had an array of children in info i could say `info.children.0.age` where `0`(zero) is the index of the array.

This is to make it easy to reach deep into your objects without having to change them to work with filtering, sorting or
grouping. All these props also take functions for power, read more below.

#### Filtering/Searching Items
To filter the list you can use the `filterBy` prop which narrows down your list to be more specific.

##### filterBy prop
`filterBy` can be a string or a function. The function must return true or false where false means the item will be 
not displayed. The function is called with two arguments, the item and its index. If you pass a string, you can use 
`dot notation`. 

```
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

For more power we can use a function to filter people below 20 years old like this.

```
filterOutPeopleBelowTwenty = (person, index) => {
    return person.info.age >= 20;
}
...

return (
    <ul>
        <FlatList 
            list={this.props.people} 
            renderItem={this.renderPerson}
            filterBy={this.filterOutPeopleBelowTwenty}
            />
    </ul>
)
```

##### Searching
There is no prop for searching yet but we can take advantage of the `filterBy` to narrow our list when users type in a 
search field like so:

```
state = {
    searchTerm: ''
}

matchSearchTerm = (person, index) => {
    return `${person.firstName} ${person.lastName}`.search(this.state.searchTerm) >= 0;;
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
                filterBy={this.matchSearchTerm}
                />
        </ul>
    </>
)
```

#### Sorting Items
There are two ways to sort the list. You can sort the entire list by using props `sort` and `sortBy` or sort the groups
by using prop `sortGroupBy`. You also can control the direction of the sort by using props `sortDesc` and `sortGroupDesc`.
By default, everything is sorted ascending.

##### sort prop
`sort` prop simple tells FlatList to sort items and this works great for list that contains **string** or **numbers**.
It has no effect on list of **arrays** or **objects**.

Below example will sort the numbers from -1(negative one) to 7(seven):

```
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

##### sortBy prop
`sortBy` should be a string representing the key of the **object** or **array** and can use `dot notation`. This is 
great when the lists that are not made of **string** or **numbers**.

##### sortDesc prop
`sortDesc` will affect the whole list and changes sorting from ascending to descending.

```
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

##### sortGroupDesc prop
`sortGroupDesc` is similar to `sortDesc` but will only affect groups. This should be used along with grouping props.

##### ignoreCaseOnWhenSorting prop
`ignoreCaseOnWhenSorting` is another sorting control that simply forces FlatList to ignore casing. This is great for 
when you don't care about exact match on casing and can be used with searching.

#### Grouping Items
Grouping is a powerful feature and by default FlatList will add a `<hr/>` in between groups but you can override this
as well by using `groupSeparator` props. You can control list grouping with props `groupBy` and `groupOf`.

##### groupBy prop
`groupBy` can either be a string using `dot notation` or a function for more control. The function will be called with
two arguments, the item and its index on the list and should return a string to identify the group.


The example below will group everybody with same last name.

```
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
```
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
```
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
descending order and it will also render the label to identify each group.
```
...

return (
    <ul>
        <FlatList 
            list={this.props.people} 
            renderItem={this.renderPerson}
            groupBy={(item, index) => item.info.age > 30 ? 'over' : 'under' }
            sortDesc
            sortGroupDesc
            groupSeparator={(group, index) => {
                return (<h3>{group[0].info.age > 30 ? 'Over 30 years old' : 'Under 30 years old'}</h3>)
            }}
            />
    </ul>
)
```

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

### Note

```
Styling will only affect position and size of the items, you can choose to style your items however you like.
```

## Author

[Elson Correia Portfolio](https://elsoncorreia.com/)

