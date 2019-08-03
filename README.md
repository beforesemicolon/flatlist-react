# FlatList React

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

### Dot Notation for string
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

#### Grouping Items

##### Custom Group Separator

#### Styling (Grid and Row)

## Author

[Elson Correia Portfolio](https://elsoncorreia.com/)

