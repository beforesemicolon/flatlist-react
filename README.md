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
    {firstName: 'Elson', lastName: 'Correia', age: 28},
    {firstName: 'John', lastName: 'Doe', age: 18},
    {firstName: 'Jane', lastName: 'Doe', age: 34},
    {firstName: 'Maria', lastName: 'Carvalho', age: 22},
    {firstName: 'Kelly', lastName: 'Correia', age: 23},
    {firstName: 'Don', lastName: 'Quichote', age: 39},
    {firstName: 'Marcus', lastName: 'Correia', age: 2},
    {firstName: 'Bruno', lastName: 'Gonzales', age: 25},
    {firstName: 'Alonzo', lastName: 'Correia', age: 44}
  ]
```

Now inside your component file, we create a function `renderPerson` that will be passed to `renderItem`:

```
import FlatList from 'flatlist-react';

...

renderPerson = (person, idx) => {
  return (
      <li key={`${person.firstName}-${idx}`}>
        <b>{person.firstName} {person.lastName}</b> (<span>{person.age}</span>)
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

#### Filtering Items (Searching)

##### Searching

#### Sorting Items

#### Grouping Items

##### Custom Group Separator

#### Styling (Grid and Row)

## Author

[Elson Correia Portfolio](https://elsoncorreia.com/)

