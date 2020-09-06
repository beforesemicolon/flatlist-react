<h1
style="
color: #666;
background-color: #f2f2f2;
padding: 10px 20px;
">
FlatList React
</h1>

### Install

Make sure you are running **react** and **react-dom** version **16.8.0+**.

```npm install flatlist-react```

### Props Format

FlatList has alternative ways to present your props in order to make things easier to change and quicker to specify.

There are available **shorthands props** just in case you want to make batch updates or want to keep things nicely together:
- [`group`](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#grouping)
- [`sort`](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#sorting)
- [`search`](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#searching)
- [`paginate`](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#pagination)
- [`scrollToTop`](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#scrolltotop)
- [`display`](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#styling).

For example:

There are several props for [grouping](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#grouping) but there is also a
`group` prop which takes all these props all at once.

```jsx
// PeopleList.jsx
return (
    <ul>
        <FlatList
          list={this.props.people}
          renderItem={this.renderPerson}
          groupBy="details.name"
          groupSeparator={YourCustomGroupSeparatorComponent}
          groupSeparatorAtTheBottom
          groupSortedBy="details.age"
          groupSortedDescending
          groupSortedCaseInsensitive
        />
    </ul>
)

```
**VS**
```jsx
// PeopleList.jsx
return (
    <ul>
        <FlatList
          list={this.props.people}
          renderItem={this.renderPerson}
          group={{ // great if you want to toggle/change with state in one update
            by: "details.name",
            separator: YourCustomGroupSeparatorComponent,
            separatorAtTheBottom: true,
            sortedBy: 'details.age',
            sortedDescending: true,
            sortedCaseInsensitive: true
          }}
        />
    </ul>
)

```

#### Also...

Notice the format of `groupBy` prop value? You can use **dot notation** to traverse your object and tell FlatList which value to grab so if you have the following object...

```js
const person = {
  name: "John Doe",
  occupation: {
    name: "Engineer",
    companyName: "Example Inc."
  },
  details: {
    age: 30,
    dob: "Jan-2-1991"
  },
  children: [
    {
      name: "Lil John",
      details: {
        age: 2,
        dob: "Aug-5-2017"
      }
    },
    ...
  ]
}
```
... you can specify props like:
```jsx
// PeopleList.jsx
return (
    <ul>
        <FlatList
          list={this.props.people}
          renderItem={this.renderPerson}
          groupBy="occupation.name"
          sortBy="details.age"
          searchBy="children.0.name"
        />
    </ul>
)

```

## Components
FlatList also offers internal components for usage to further help with your list rendering.
### PlainList
`PlainList` is a simpler version of FlatList. It is an ideal option when all you want to do is render a list.
It supports only the following props:
- [list](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#list-and-renderitem)
- [renderItem](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#list-and-renderitem)
- [renderWhenEmpty](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#renderwhenempty)
- [renderOnScroll](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#renderonscroll)
- [wrapperHtmlTag](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#wrapperhtmltag)

It is the ideal component to render small simple lists like dropDown, selection options or any other
list you dont plan to do anything besides rendering them and leave it.
```jsx
import FlatList, {PlainList} from 'flatlist-react'

<PlainList
  list={this.props.people}
  renderItem={this.renderPerson}
  />

```

## Rendering

Take in consideration the following list passed to component `PeopleList`:

```ts
// App.jsx
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

  <PeopleList people={people}/>
```

#### list and renderItem
###### list: Map | Set | Object | Array
###### renderItem: (item, index) => JSX.Element

Now inside your component file, we create a function `renderPerson` that will be passed to `renderItem`:

```jsx
// PeopleList.jsx
import FlatList from 'flatlist-react';

...

renderPerson = (person, idx) => {
  return (
      <li key={idx}>
        <b>{person.firstName} {person.lastName}</b> (<span>{person.info.age}</span>)
      </li>
  );
}

...

return (
    <ul>
        <FlatList
          list={this.props.people}
          renderItem={this.renderPerson}/>
    </ul>
)
```

**FlatList** has **two required props**, `list` and `renderItem`. `list` can be an **Object**, **Array**, **Map** or **Set** and it will make sure to extract the values.

The `list` prop can also be empty and you can use `renderWhenEmpty` prop to tell **FlatList** what to render when the list is empty, like so:

```jsx
// PeopleList.jsx
import FlatList from 'flatlist-react';

...

blank = () => (
    <div>
      List has no items yet!
    </li>
);

...

return (
    <ul>
        <FlatList
          list={this.props.people}
          renderItem={this.renderPerson}
          renderWhenEmpty={blank} // pass a component or a function that returns a component/html
          />
    </ul>
)
```

#### renderWhenEmpty
###### () => JSX.Element

`renderWhenEmpty` is a powerful prop that you can use to render things in case a user applied filters or searched and nothing matched. There will be more examples illustrating what you can use these for as we go along.

#### limit
###### number | string

`limit` is a great prop if you have a list, for example, of 20 but only intend to show 10. It
also takes an interval representing a slice (works like js slice) of the list you intend to show, for example:

```jsx
// hard limit
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  limit={5} // will only render the first 5 items of the list
  />

// close interval
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  limit="2,8" // will show items 3, 4, 5, 6, 7, and 8
  />

<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  limit="5,-2" // will show items 6 until minus 2 items from the end
  />

// open interval
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  limit="5," // will show items 6 till the end of the list
  />
```

#### reversed
###### boolean

`reversed` does exactly what you think, it will reverse your list and it is different from
javascript 'reverse' method on Array because:
1. it will reverse an Array, Object, Map or Set list;
2. it does not reverse a list in place.

```jsx
<FlatList
  list={[2,4,5]}
  renderItem={(item, k) => <span key={k}>{item}</span>}
  reversed
  />

/* outputs
<span>5</span>
<span>4</span>
<span>2</span>
*/

```

#### wrapperHtmlTag
###### string

FlatList, by default, will not wrap your items in a container. It will take your list and spit out a html/jsx representation of it.

If you want to wrap your list in a container you can user
`wrapperHtmlTag` to specify which tag to use so then you can treat FlatList as a normal html tag and set any html props that you would normally set.

```jsx
<PlainList
  list={[2,4,5]}
  renderItem={(item, k) => <span key={k}>{item}</span>}
  wrapperHtmlTag="div"
  // any html props for div tag
  id="my-container"
  style={{background: blue}}
  onMouseOver={this.mouseOverHandler} // will attach events
  ref={this.containerRef} // will forward ref
  />

/* outputs
<div id="my-container" style="background: blue">
  <span>5</item>
  <span>4</item>
  <span>2</item>
</div>
*/

```

## Render Optimization
The goal is to make your list render as quick and easy as posible and FlatList come with some props that help you achieve just that.

### renderOnScroll
###### boolean
The `renderOnScroll` will render your list to fill the container and then stop. It will wait for the user scroll event to
further render the remainder items. This is great if creating a lot of dom elements takes time and you dont want the browser
to become iresponsive while rendering a very large list. 

It is different from [pagination(Infinite Scrolling)](https://github.com/ECorreia45/flatlist-react/blob/documentation/documentation/Doc.md#pagination). With pagination you start with some items and when the user reaches the
end it will fetch some more while showing the loading indicator.

`renderOnScroll` is great for when you have large list and rendering it all at once would take long and freeze the browser.

It is also good to use on lists which user normally dont reach the end anyways specially if you are letting them search, or filter the list.

`renderOnScroll` prop will not work while pagination props are being used.

```jsx
<PlainList
  list={[1,2,3,...10000000]}
  renderItem={(item, k) => <span key={k}>{item}</span>}
  renderOnScroll
  />
```

## Pagination
FlatList comes with pagination out of the box. This is specially great for when fetching all the items from api would take long
so you start with fetching a small portion and then let the user scroll to the bottom, show the loading indicator while you
fetch some more.

To make it work you need to render `FlatList` inside of a scrolling container with "`overflow: auto`" or "`overflow: scroll`".
If the container wrapping flatlist does not scroll it miss the point of infinite scrolling.

Pagination props will not work while `renderOnScroll` is being used.

### hasMoreItems
###### boolean
You start by telling FlatList if there are more items to come with `hasMoreItems` prop. It will then start monitor scrolling
and show loading indicator when the user reaches the end of the list.

When you are done fetching the whole list you can set this to "false" and FlatList will know you have the whole list.

### loadMoreItems
###### () => void
No pagination will be done until you specify a function to call when the user reaches the end of the list and that's why you 
need to specify `loadMoreItems` prop with a function that will do the fetching of the items as shown in the below example:

If the list return does not fill the container, loadMoreItems will be called until there is not more items or the loading
indicator is no longer visible.

If for some reason after the initial load the user applies a filter or do a search and the visible list becomes shorter,
`loadMoreItems` will be called as well. `loadMoreItems` will be called whenever the loading incator is visible in the container
as long as there are more items.
```jsx
state = {
    hasMoreItems: false,
    offset: 0,
    myApiData: [],
    loading: true // important so the right blank message is shown from the start
}

componentDidMount() {
    this.fetchData();
}

showBlank = () => {
    if (this.state.myApiData.length === 0 && this.state.loading) {
        return <div>Loading list...</div>
    }
    
    return <div>No items for this list</div>
}

fetchData = () => {
    // this is simple example but most of good paginated apis will give you total items count and offset information
    fetch(`/api/endpoint?size=25&offset=${this.state.offset}`)
        .then(res => res.json())
        .then(data => {
            this.setState(prevState => ({
                offset: data.pagination.nextOffset,
                hasMoreItems: data.pagination.nextOffset < data.pagination.totalItems,
                myApiData: [...prevState.myApiData, ...data.results],
                loading: false
            })) 
        })
}

<FlatList
  list={this.state.myApiData}
  renderItem={(item) => <div key={item.id}>{item.name}</div>}
  renderWhenEmpty={this.showBlank} // let user know if initial data is loading or there is no data to show
  hasMoreItems={this.state.hasMoreItems}
  loadMoreItems={this.fetchData}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  renderWhenEmpty={this.showBlank} // let user know if initial data is loading or there is no data to show
  paginate={{
    hasMore: this.state.hasMoreItems,
    loadMore: this.fetchData
  }}
  />
```

### paginationLoadingIndicator
###### ComponentLike | () => JSX.Element

The default loading indicator is super simple so it is a good idea to change it for something that will go well with your
application and further inform the user of whats going on. `paginationLoadingIndicator` let's you specify a component
to show while items are being fetched.
```jsx
...
<FlatList
  list={this.state.myApiData}
  renderItem={(item) => <div key={item.id}>{item.name}</div>}
  renderWhenEmpty={this.showBlank} // let user know if initial data is loading or there is no data to show
  hasMoreItems={this.state.hasMoreItems}
  loadMoreItems={this.fetchData}
  paginationLoadingIndicator={<div style={{background: '#090'}}>Getting more items...</div>}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  renderWhenEmpty={this.showBlank} // let user know if initial data is loading or there is no data to show
  paginate={{
    hasMore: this.state.hasMoreItems,
    loadMore: this.fetchData,
    loadingIndicator: <div style={{background: '#090'}}>Getting more items...</div>
  }}
  />
```
### paginationLoadingIndicatorPosition
###### string
You can also specify where you want the loading indicator to show at the bottom. By default it will show at the **"left"** but,
you can also specify **"center"** or **"right"**.

```jsx
...
<FlatList
  list={this.state.myApiData}
  renderItem={(item) => <div key={item.id}>{item.name}</div>}
  renderWhenEmpty={this.showBlank} // let user know if initial data is loading or there is no data to show
  hasMoreItems={this.state.hasMoreItems}
  loadMoreItems={this.fetchData}
  paginationLoadingIndicator={<div style={{background: '#090'}}>Getting more items...</div>}
  paginationLoadingIndicatorPosition="center"
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  renderWhenEmpty={this.showBlank} // let user know if initial data is loading or there is no data to show
  paginate={{
    hasMore: this.state.hasMoreItems,
    loadMore: this.fetchData,
    loadingIndicator: <div style={{background: '#090'}}>Getting more items...</div>,
    loadingIndicatorPosition: 'center'
  }}
  />
```
## Filtering

To filter the list you can specify `filterBy` prop that takes either a string or a function.

### filterBy
###### string | (item, index) => boolean
The string represents the key in the list which value is evaluated to **truthy** or **falsy** to be included or not.

```jsx
<FlatList
  list={[{age: 2},{age: 0},{age: ''},{age: null},{age: undefined}]}
  renderItem={(item, k) => <span key={k}>{item.age}</span>}
  filterBy="age"
  />

/* outputs
<span>2</span> // since only "2" is truthy
*/

```
If you pass a function, it will be called with the item and the index and the function must return **true** or **false** to include the item or not.
```jsx
<FlatList
  list={[{age: 2},{age: 0},{age: ''},{age: null},{age: undefined}]}
  renderItem={(item, k) => <span key={k}>{item.age}</span>}
  filterBy={item => (typeof item.age === 'number')}
  />

/* outputs
<span>2</span>
<span>0</span>
*/

```

## Searching

Searching with FlatList is powerful and you have full control of your search. You can do **single or multiple keys search** and set options for each one.

Let's take the following setup:

```jsx
state = {
  searchTerm: ''
}

onSearchInput = e => this.setState({searchTerm: e.target.value});
```
### searchTerm
###### string
Provide the search term to be use in the search.

If the list is a list of strings or numbers, you just need to provide `searchTerm` prop to start the search, as it will look for the first key by default.

The search is done case sensitive, needs to be at least 3 characters long and the whole string is used in a match.

You can change these defaults with props in this session.
```jsx
<input value={this.state.searchTerm} onChange={this.onSearchInput}/>

<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  searchTerm={this.state.searchTerm}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  search={{
    term: this.state.searchTerm
  }}
  />
```
### searchBy
###### string | [string | {key: string, caseInsensitive: boolean}] | (item, index) => boolean
The `searchBy` prop is a rich prop. It can be a string, an array of strings, an array of object options or a function.
```jsx
// single key search
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  searchBy="firstName"
  searchTerm={this.state.searchTerm}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  search={{
    by: "firstName",
    term: this.state.searchTerm
  }}
  />

```
```jsx
// multiple keys search
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  searchBy={["firstName", "lastName"]}
  searchTerm={this.state.searchTerm}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  search={{
    by: ["firstName", "lastName"],
    term: this.state.searchTerm
  }}
  />
```
If you truly want to control the matching yourself, `searchBy` as a function is your best option. The function will be called for every item in the list and you must return **true** or **false**.
```jsx
handleSearchMatch = (item) => (
  item.firstName.toLowerCase === this.state.searchTerm.toLowerCase
);

<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  searchBy={this.handleSearchMatch}
  searchTerm={this.state.searchTerm}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  search={{
    by: this.handleSearchMatch,
    term: this.state.searchTerm
  }}
  />
```
### searchCaseInsensitive
###### boolean
The above example could use this option instead. It pretty much ignores the casing of the texts and try to do a match. By default the search is case sensitive.

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  searchBy=["firstName", "lastName"]
  searchTerm={this.state.searchTerm}
  searchCaseInsensitive
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  search={{
    by: ["firstName", "lastName"],
    term: this.state.searchTerm,
    caseInsensitive: true
  }}
  />
```

Let's say you decided that `lastName` still needs to be case sensitive when searching. You can change that option in place as follows:

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  searchBy=["firstName", {by: "lastName", caseInsensitive: false}]
  searchTerm={this.state.searchTerm}
  searchCaseInsensitive
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  search={{
    by: ["firstName", {key: "lastName", caseInsensitive: false}],
    term: this.state.searchTerm,
    caseInsensitive: true
  }}
  />
```

This will make sure you do case insensitive search on "firstName" but keep the sensitivity for "lastName" matches.

### searchMinCharactersCount
###### number

By default FlatList will wait for at least **3 characters** before start the search. You can change this by providing `searchMinCharactersCount` prop. Searching the entire List can be intensive so we recommend sticking with the default depending on your situation.

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  searchBy=["firstName", "lastName"]
  searchTerm={this.state.searchTerm}
  searchCaseInsensitive
  searchMinCharactersCount={2}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  search={{
    by: ["firstName", "lastName"],
    term: this.state.searchTerm,
    caseInsensitive: true,
    minCharactersCount: 2
  }}
  />
```

### searchOnEveryWord
###### boolean

By default the whole string is used in a match and that follows the default search system, for example:

**given following list of strings:**
```js
const list = [
  "John",
  "Jonny",
  "Joe and John",
  "Jonny jonny Joe"
]
```

**searchTerm:** "John" would match items **1** and **3**

**searchTerm:** "John Joe" would match none

**searchTerm:** "Jonny" would match items **2** and **4**

**searchTerm:** "jonny Joe" would match item **4**

...but with `searchOnEveryWord` prop you would have different results like so:

**searchTerm:** "John" would match items **1** and **3**

**searchTerm:** "John Joe" would match items **1**, **3** and **4**

**searchTerm:** "Jonny" would match items **2** and **4**

**searchTerm:** "jonny Joe" would match items **3** and **4**

So searching for "John Joe" is like you are searching for "John" and "Joe" in the same string separately. Every word is treated as a "searchTerm" and the item will be included if at least one matches.

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  searchBy=["firstName", "lastName"]
  searchTerm={this.state.searchTerm}
  searchCaseInsensitive
  searchMinCharactersCount={2}
  searchOnEveryWord
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  search={{
    by: ["firstName", "lastName"],
    term: this.state.searchTerm,
    caseInsensitive: true,
    minCharactersCount: 2,
    onEveryWord: true
  }}
  />
```

## Sorting
This options uses javascript's default search algorithm with enhanced handling to do the magic for you. Like `search`, you can sort on **single** and **multiple** keys with global or individual settings.

### sort
###### boolean | SortOptions
The `sort` prop can either be a boolean or an object shorthand for sorting.

In case you have a flat list of strings or numbers you may just use it as a boolean since there is no keys to sort the list by.

```jsx
<FlatList
  list={[4, 8, 1, 8, 0]}
  renderItem={(n, i) => <span key={i}>{n}</span>}
  sort
  />

/* outpus
<span>0</span>
<span>1</span>
<span>4</span>
<span>8</span>
<span>8</span>
*/
```

### sortBy
###### string | [string | {key: string, descending: boolean, caseInsensitive: boolean}] | (item, index) => boolean
The `sortBy` prop is a rich prop. It can be a string, an array of strings or object options or a function.

Let's say we want to sort our people list by age.
```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  sortBy="info.age"
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  sort={{
    by: "info.age"
  }}
  />
```

### sortCaseInsensitive
###### boolean

By default the sorting is case sensitive and this is the prop to change that all together.

Let's say this time we want to sort our people list by first and last name:
```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  sortBy=["firstName", "lastName"]
  sortCaseInsensitive
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  sort={{
    by: ["firstName", "lastName"],
    caseInsensitive: true
  }}
  />
```

In case you want case-insensitive just for the "lastName" you could specify your options like so:

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  sortBy=[{key: "firstName", caseInsensitive: false}, "lastName"]
  sortCaseInsensitive
  />

// --- OR ---
<FlatList 
  list={this.props.people}
  renderItem={this.renderPerson}
  sort={{
    by: [{key: "firstName", caseInsensitive: false}, "lastName"],
    caseInsensitive: true
  }}
  />
```

### sortDescending
###### boolean

By default all sort results will be in ascending order and this prop can be applied on every key as well as individual one, as so:

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  sortBy=["firstName", {key: "lastName", descending: false}]
  sortCaseInsensitive
  sortDescending
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  sort={{
    by: ["firstName", {key: "lastName", descending: false}],
    descending: true,
    caseInsensitive: true
  }}
  />
```
The above example will sort the list by "firstName" in descending and "lastName" in ascending order.

This is a great option if you plan on representing the list as table.

## Grouping
Whenever you see a transactions list you have seen a grouped list. Transactions are normally grouped by days
and this props allows you to create any grouping kind you want for your list.

### groupOf
###### number
Lets say we just want to group a list and every group should have 3 items in it. Thats what the `groupOf` prop
allows you to do. It lets you create equal size groups.

You can combine `groupOf` and `groupBy` to limit the size you group your list by.

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  groupOf={2}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  group={{
    of: 2
  }}
  />
```

### groupBy
###### string | (item, index) => string
The `groupBy` prop can either be a string representing the key to group the list by or a function that
must return a string representing the label to represent the group by, a group label. Please check
`groupSeparator` to understand how group labeling works.

Taking our people array in consideration, lets group people by their last name:

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  groupBy="lastName"
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  group={{
    by: "lastName"
  }}
  />
```

### groupSeparator
###### ComponentLike<{group, groupLabel}> | (group, index, groupLabel) => JSX.Element
By default, every group will be separated with an horizontal ruler tag (`<hr/>`) and you can change this
by providing a `groupSeparator`. This prop expects a function that returns a JSX element and the function is called with
the group, the index of the group and the group label.

When you specify a `groupOf` the label will the order of the groups. If you specify a `groubBy` prop
the group label will be the value of the field you provide or the string you return in case `groupBy` is
a function. Let's illustrate that:

```jsx
groupSeparator = (group, idx, groupLabel) => <div className="group-separator">{groupLabel}</div>;

<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  groupOf={2}
  groupSeparator={groupSeparator}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  group={{
    of: 2,
    separator: this.groupSeparator
  }}
  />

/** Group Separators will render
<div className="group-separator">1</div>
... items
<div className="group-separator">2</div>
... items
<div className="group-separator">3</div>
... etc
*/
```
Now using a `groupBy` as a string representing the key in the person object:
```jsx
groupSeparator = (group, idx, groupLabel) => <div className="group-separator">{groupLabel}</div>;

<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  groupBy="lastName"
  groupSeparator={this.groupSeparator}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  group={{
    by: "lastName",
    separator: this.groupSeparator
  }}
  />

/** Group Separators will render
<div className="group-separator">Correia</div>
... items
<div className="group-separator">Doe</div>
... items
<div className="group-separator">Carvalho</div>
... etc
*/
```
Now using a `groupBy` as a function but we will group by age now:
```jsx
groupSeparator = (group, idx, groupLabel) => <div className="group-separator">{groupLabel}</div>;

<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  groupBy={(person) => (person.info.age > 30 ? "Over 30" : "Under 30")}
  groupSeparator={this.groupSeparator}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  group={{
    by: (person) => (person.info.age > 30 ? "Over 30" : "Under 30"),
    separator: this.groupSeparator
  }}
  />

/** Group Separators will render
<div className="group-separator">Under 30</div> 
// under 30 is first because the first item person age is 24 so it is the first group created
// you can sort the list in descending order to flip this
... items
<div className="group-separator">Over 30</div>
... items
*/
```

### groupSeparatorAtTheBottom
###### boolean
All separators are put on top of their respective group. You will have separator 1 then group 1 then separator 2, etc.
If you wish to change this behavior just specify `groupSeparatorAtTheBottom` for the inverse.

```jsx
groupSeparator = (group, idx, groupLabel) => <div className="group-separator">{groupLabel}</div>;

<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  groupBy={(person) => (person.info.age > 30 ? "Over 30" : "Under 30")}
  groupSeparator={this.groupSeparator}
  groupSeparatorAtTheBottom
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  group={{
    by: (person) => (person.info.age > 30 ? "Over 30" : "Under 30"),
    separator: this.groupSeparator,
    separatorAtTheBottom: true
  }}
  />

/** Group Separators will render
... items
<div className="group-separator">Under 30</div> 
... items
<div className="group-separator">Over 30</div>
*/
```

### groupReversed
###### boolean
You also have the option to reverte each group the same way you would reverse an entire list.
```jsx
groupSeparator = (group, idx, groupLabel) => <div className="group-separator">{groupLabel}</div>;

<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  groupBy={(person) => (person.info.age > 30 ? "Over 30" : "Under 30")}
  groupSeparator={this.groupSeparator}
  groupSeparatorAtTheBottom
  groupReversed
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  group={{
    by: (person) => (person.info.age > 30 ? "Over 30" : "Under 30"),
    separator: this.groupSeparator,
    separatorAtTheBottom: true,
    reversed: true
  }}
  />
```
### groupSorted
###### boolean
The `groupSorted` prop works like the `sort` prop. It is great if you have a list os strings or numbers which you
can't specify the keys to sort by.

```jsx
groupSeparator = (group, idx, groupLabel) => <div className="group-separator">{groupLabel}</div>;

<FlatList
  list={[3, 7, 1, 8, 0, 4]}
  renderItem={(item, idx) => <span key={idx}>{item}</span>}
  groupBy={(number) => (number > 5 ? "Over 5" : "Under 5")}
  groupSeparator={this.groupSeparator}
  groupSeparatorAtTheBottom
  groupReversed
  groupSorted
  />

// --- OR ---
<FlatList
  list={[3, 7, 1, 8, 0, 4]}
  renderItem={(item, idx) => <span key={idx}>{item}</span>}
  group={{
    by: (number) => (number > 5 ? "Over 5" : "Under 5"),
    separator: this.groupSeparator,
    separatorAtTheBottom: true,
    reversed: true,
    sorted: true
  }}
  />
```
### groupSortedBy
###### string | [string | {key: string, descending: boolean, caseInsensitive: boolean}]
Same as `sortBy`, `groupSortedBy` will be applied just at the group level.

The below example will be sorted on "firstName" and "lastName" both ascending(default).
```jsx
groupSeparator = (group, idx, groupLabel) => <div className="group-separator">{groupLabel}</div>;

<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  groupBy={(person) => (person.info.age > 30 ? "Over 30" : "Under 30")}
  groupSeparator={this.groupSeparator}
  groupSeparatorAtTheBottom
  groupReversed
  groupSortedBy={["firstName", "lastName"]}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  group={{
    by: (person) => (person.info.age > 30 ? "Over 30" : "Under 30"),
    separator: this.groupSeparator,
    separatorAtTheBottom: true,
    reversed: true,
    sortedBy: ["firstName", "lastName"]
  }}
  />
```

### groupSortedDescending
###### boolean
In this example we are sorting the groups descending but only for the "firstName". We are specifying "descending"
false for "lastName".

```jsx
groupSeparator = (group, idx, groupLabel) => <div className="group-separator">{groupLabel}</div>;

<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  groupBy={(person) => (person.info.age > 30 ? "Over 30" : "Under 30")}
  groupSeparator={this.groupSeparator}
  groupSeparatorAtTheBottom
  groupReversed
  groupSortedBy={["firstName", {key: "lastName", descending: false}]}
  groupSortedDescending
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  group={{
    by: (person) => (person.info.age > 30 ? "Over 30" : "Under 30"),
    separator: this.groupSeparator,
    separatorAtTheBottom: true,
    reversed: true,
    sortedBy: ["firstName", {key: "lastName", descending: false}],
    descending: true
  }}
  />
```

### groupSortedCaseInsensitive
###### boolean
Similarly to `sortCaseInsensitive`, you can change thi case sensitiveness at the group level.

In this example we are sorting the groups case insensitive but only for the "firstName". We are specifying "caseInsensitive"
false for "lastName".

```jsx
groupSeparator = (group, idx, groupLabel) => <div className="group-separator">{groupLabel}</div>;

<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  groupBy={(person) => (person.info.age > 30 ? "Over 30" : "Under 30")}
  groupSeparator={this.groupSeparator}
  groupSeparatorAtTheBottom
  groupReversed
  groupSortedBy={["firstName", {key: "lastName", descending: false, caseInsensitive: false}]}
  groupSortedDescending
  groupSortedCaseInsensitive
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  group={{
    by: (person) => (person.info.age > 30 ? "Over 30" : "Under 30"),
    separator: this.groupSeparator,
    separatorAtTheBottom: true,
    reversed: true,
    sortedBy: ["firstName", {key: "lastName", descending: false, caseInsensitive: false}],
    descending: true,
    caseInsensitive: true
  }}
  />
```

## Styling
Styling props are the quiquest way to organize your list whether in rows or responsive grid. This session will
grow with time and soon orgnainizing the list will become much much simpler.

### displayGrid
###### boolean
The `displayGrid` prop will put your list into a responsive grid layout with columns being minimum 200px
and gap of 20px. You can change these defaults with props in this session.

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  displayGrid
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  display={{
    grid: true,
  }}
  />
```
### minColumnWidth
###### string
The `minColumnWidth` should be a string with number and unit just like CSS, for example "100px", "50%".
```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  displayGrid
  minColumnWidth="100px"
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  display={{
    grid: true,
    minColumnWidth: "100px"
  }}
  />
```
### gridGap
###### string
The `gridGap` should be a string with number and unit just like CSS, for example "100px", "50%".
```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  displayGrid
  minColumnWidth="100px"
  gridGap="50px"
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  display={{
    grid: true,
    minColumnWidth: "100px",
    gridGap: "50px"
  }}
  />
```
### displayRow
###### boolean
The `displayRow` prop will force all items to be 100% of the container and be stacked.

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  displayRow
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  display={{
    row: true,
  }}
  />
```
### rowGap
###### string
The `rowGap` prop will add spacing in between the stacked rows.
```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  displayRow
  rowGap="25px"
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  display={{
    row: true,
    rowGap: "25px"
  }}
  />
```

## scrollToTop
Scrolling to top goes well with rendering list specially if it a long one. 

To make it work you need to render `FlatList` inside of a scrolling container with "`overflow: auto`" or "`overflow: scroll`".
If the container wrapping flatlist does not scroll it miss the point of scrolling to top.

You don't need to set this prop if you set `scrollToTopButton` prop. `scrollToTop` is only if you want to
start with the default button.  

By default a simple button will be shown at the bottom right after user has scrolled 50px from the top. The button is 
positioned 20px from the corner but all these are options you can customize at your liking.

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  srollToTop
  />
```

### scrollToTopButton
###### JSX.Element | () => JSX.Element
If you don't like the super simple default button you can pass yours using `scrollToTopButton` prop.
If you specify the `scrollToTopButton` you don't need to also set `scrollToTop` prop.

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  srollToTop
  srollToTopButton={MyAwesomeScrollToTopButton}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  srollToTop={{
    button: MyAwesomeScrollToTopButton
  }}
  />
```
### scrollToTopOffset
###### number
The offset is how far you want the user to scroll to start showing the button. The default is **50px**

```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  srollToTop
  srollToTopButton={MyAwesomeScrollToTopButton}
  srollToTopOffset={150}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  srollToTop={{
    button: MyAwesomeScrollToTopButton,
    offset: 150
  }}
  />
```
### scrollToTopPadding
###### number
The padding is how far from the corner the button should be positioned. The default is **20px**
```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  srollToTop
  srollToTopButton={MyAwesomeScrollToTopButton}
  srollToTopOffset={150}
  srollToTopPadding={25}
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  srollToTop={{
    button: MyAwesomeScrollToTopButton,
    offset: 150,
    padding: 25
  }}
  />
```
### scrollToTopPosition
###### string
The position is where you want the button to be placed. The default is **"bottom right"** but you can also specify 
**"bottom left"**, **"top left"** and **"top right"**
```jsx
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  srollToTop
  srollToTopButton={MyAwesomeScrollToTopButton}
  srollToTopOffset={150}
  srollToTopPadding={25}
  srollToTopPosition="top right"
  />

// --- OR ---
<FlatList
  list={this.props.people}
  renderItem={this.renderPerson}
  srollToTop={{
    button: MyAwesomeScrollToTopButton,
    offset: 150,
    padding: 25,
    position: "top right"
  }}
  />
```

### Thank You
Please show your support, help make this better, suggest features, report bugs and even contribute to this 
project.

Share this project with your friends and colleages if you love it like I do.

thank you!

-- ec
