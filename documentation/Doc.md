<h1
style="
color: #666;
background-color: #f2f2f2;
padding: 10px 20px;
">
FlatList React
</h1>


| Features                                    | Props / Components                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|:--------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Rendering](#rendering)                     | [list](#list-and-renderitem), [renderItem](#list-and-renderitem), [renderWhenEmpty](#renderwhenempty), [wrapperHtmlTag](#wrapperhtmltag), [limit](#limit), [reversed](#reversed), **[inverted](#inverted-mode)**                                                                                                                                                                                                                                                                                                                |
| [Render Optimization](#render-optimization) | [renderOnScroll](#renderonscroll)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [Pagination (Infinite Scroll)](#pagination) | [hasMoreItems](#hasmoreitems), [loadMoreItems](#loadmoreitems), [paginationLoadingIndicator](#paginationloadingindicator), [paginationLoadingIndicatorPosition](#paginationloadingindicatorposition), **[scrollingContainerId](#scrollingcontainerid)**                                                                                                                                                                                                                                                                        |
| [Filtering](#filtering)                     | [filterBy](#filterby)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| [Searching](#searching)                     | [searchTerm](#searchterm), [searchBy](#searchby), [searchOnEveryWord](#searchoneveryword), [searchMinCharactersCount](#searchmincharacterscount), [searchCaseInsensitive](#searchcaseinsensitive), **[regex support](#regex-search)**                                                                                                                                                                                                                                                                                           |
| [Sorting](#sorting)                         | [sortBy](#sortby), [sortCaseInsensitive](#sortcaseinsensitive), [sortDescending](#sortdescending)                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [Grouping](#grouping)                       | [groupOf](#groupof), [groupBy](#groupby), [groupSeparator](#groupseparator), [groupSeparatorAtTheBottom](#groupseparatoratthebottom), [groupReversed](#groupreversed), [groupSorted](#groupsorted), [groupSortedBy](#groupsortedby), [groupSortedDescending](#groupsorteddescending), [groupSortedCaseInsensitive](#groupsortedcaseinsensitive), **[renderGroupHeader](#group-headers--footers)**, **[renderGroupFooter](#group-headers--footers)**                                                                         |
| [Styling](#styling)                         | [displayGrid](#displaygrid), [gridGap](#gridgap), [minColumnWidth](#mincolumnwidth), [displayRow](#displayrow), [rowGap](#rowgap), **[displayTable](#table-display)**                                                                                                                                                                                                                                                                                                                                                           |
| [scrollToTop](#scrolltotop)                 | [scrollToTopButton](#scrolltotopbutton), [scrollToTopOffset](#scrolltotopoffset), [scrollToTopPadding](#scrolltotoppadding), [scrollToTopPosition](#scrolltotopposition)                                                                                                                                                                                                                                                                                                                                                        |
| [Components](#components)                   | [PlainList](#plainlist)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| [Utilities](#utilities)                     | [sortList](#sortlist), [searchList](#searchlist), [filterList](#filterlist), [groupList](#grouplist), [limitList](#limitlist)                                                                                                                                                                                                                                                                                                                                                                                                   |


### Install

Make sure you are running **react** and **react-dom** version **19.0.0+** (for v2.x).

```npm install flatlist-react```

### Props Format

FlatList has alternative ways to present your props in order to make things easier to change and quicker to specify.

There are available **shorthands props** just in case you want to make batch updates or want to keep things nicely together:
- [`group`](#grouping)
- [`sort`](#sorting)
- [`search`](#searching)
- [`pagination`](#pagination)
- [`scrollToTop`](#scrolltotop)
- [`display`](#styling).

For example:

There are several props for [grouping](#grouping) but there is also a
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
- [list](#list-and-renderitem)
- [renderItem](#list-and-renderitem)
- [renderWhenEmpty](#renderwhenempty)
- [renderOnScroll](#renderonscroll)
- [wrapperHtmlTag](#wrapperhtmltag)

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
    </div>
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

#### inverted mode
###### boolean

Inverted mode is ideal for chat-like interfaces. When `inverted` is set to `true`:
1. The **loading indicator** is rendered at the **top** of the list.
2. Pagination is triggered when you scroll to the **top** of the container.
3. Scroll position is automatically maintained when new items are added at the top.

```jsx
<FlatList
  list={messages}
  renderItem={renderMessage}
  inverted
  hasMoreItems={hasOlderMessages}
  loadMoreItems={fetchOlderMessages}
  scrollingContainerId="chat-scroll-area"
/>
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
  ref={this.containerRef} // will forward ref (React 19+)
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

It is different from [pagination(Infinite Scrolling)](#pagination). With pagination you start with some items and when the user reaches the
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
FlatList comes with pagination out of the box. This is specially great for when fetching all the items from api would take long,
so you start with fetching a small portion and then let the user scroll to the bottom, show the loading indicator while you
fetch some more.

To make it work you need to render `FlatList` inside of a scrolling container with "`overflow: auto`" or "`overflow: scroll`".
If the container wrapping FlatList does not scroll it misses the point of infinite scrolling.

```jsx
<div style={{overflow: "auto", height: "300px"}}>
    <FlatList
        list={this.props.people}
        renderItem={this.renderPerson}
        renderWhenEmpty={this.showBlank}
    />
</div>

// --- OR ---

<FlatList
    list={this.props.people}
    renderItem={this.renderPerson}
    renderWhenEmpty={this.showBlank}
    wrapperHtmlTag="div"
    style={{overflow: "auto", height: "300px"}}
/>
```

Pagination props will not work while `renderOnScroll` is being used. Pagination already renders on scroll.

### scrollingContainerId
###### string

By default, the `InfiniteLoader` looks for the immediate parent as the scrolling container. If your list is deeply nested, you can specify the ID of the actual scrolling ancestor.

```jsx
<div id="main-scroll-area" style={{ overflow: "auto", height: "100vh" }}>
  <div className="layout-wrapper">
    <FlatList
      list={data}
      renderItem={renderItem}
      hasMoreItems={true}
      loadMoreItems={fetchMore}
      scrollingContainerId="main-scroll-area"
    />
  </div>
</div>
```

### hasMoreItems
###### boolean
You start by telling FlatList if there are more items to come with `hasMoreItems` prop. It will then start monitor scrolling
activities and the list size to show loading indicator when the user reaches the end of the list and fetching begins.

When you are done fetching the whole list you can set this to "false" and FlatList will know you have the whole list
and stop monitoring scrolling and list size.

### loadMoreItems
###### () => void
No pagination will be done until you specify a function to call when the user reaches the end of the list and that's why you 
need to specify `loadMoreItems` prop with a function that will do the fetching of the items as shown in the below example:

If the list return does not fill the container, loadMoreItems will be called until there is not more items or the loading
indicator is no longer visible.

If for some reason after the initial load the user applies a filter or do a search and the visible list becomes shorter,
`loadMoreItems` will be called as well. `loadMoreItems` will be called whenever the loading incator is visible in the container
as long as there are more items.

### paginationLoadingIndicator
###### ComponentLike | () => JSX.Element

The default loading indicator is super simple so it is a good idea to change it for something that will go well with your
application and further inform the user of whats going on. `paginationLoadingIndicator` let's you specify a component
to show while items are being fetched.

### paginationLoadingIndicatorPosition
###### string
You can also specify where you want the loading indicator to show at the bottom. By default it will show at the **"left"** but,
you can also specify **"center"** or **"right"**.

## Filtering

To filter the list you can specify `filterBy` prop that takes either a string or a function.

### filterBy
###### string | (item, index) => boolean
The string represents the key in the list which value is evaluated to **truthy** or **falsy** to be included or not.

## Searching

Searching with FlatList is powerful and you have full control of your search. You can do **single or multiple keys search** and set options for each one.

### Regex Search
v2.0 introduces support for Regular Expressions in the `searchTerm`. You can use patterns like:
*   `^Sample` - Match items starting with "Sample"
*   `.mp4$` - Match items ending with ".mp4"
*   `.*` - Wildcard matches

If the regex is invalid (e.g., `*`), the search automatically falls back to **literal string matching** so your application never crashes.

### searchTerm
###### string
Provide the search term to be use in the search.

### searchBy
###### string | [string | {key: string, caseInsensitive: boolean}] | (item, index) => boolean
The `searchBy` prop is a rich prop. It can be a string, an array of strings, an array of object options or a function.

### searchCaseInsensitive
###### boolean
Ignores the casing of the texts. Default is case sensitive.

### searchMinCharactersCount
###### number
By default FlatList will wait for at least **3 characters** before start the search. 

### searchOnEveryWord
###### boolean
If true, every word in the search term is matched separately.

## Sorting
This options uses javascript's default search algorithm with enhanced handling to do the magic for you. Like `search`, you can sort on **single** and **multiple** keys with global or individual settings.

### sort
###### boolean | SortOptions

### sortBy
###### string | [string | {key: string, descending: boolean, caseInsensitive: boolean}] | (item, index) => boolean

### sortCaseInsensitive
###### boolean

### sortDescending
###### boolean

## Grouping
Allows you to create any grouping kind you want for your list.

### groupOf
###### number
Creates equal size groups.

### groupBy
###### string | (item, index) => string
The key to group by or a function returning a group label.

### group headers & footers
###### (label, items) => ReactNode

In addition to separators, you can now render custom headers and footers for each group.

```jsx
<FlatList
  list={people}
  renderItem={renderPerson}
  groupBy="department"
  renderGroupHeader={(label, items) => (
    <div className="dept-header">
      {label} - {items.length} employees
    </div>
  )}
  renderGroupFooter={(label) => (
    <div className="dept-footer">End of {label} list</div>
  )}
/>
```

### groupSeparator
###### ComponentLike<{group, groupLabel}> | (group, index, groupLabel) => JSX.Element

### groupSeparatorAtTheBottom
###### boolean

### groupReversed
###### boolean

### groupSorted
###### boolean

### groupSortedBy
###### string | [string | {key: string, descending: boolean, caseInsensitive: boolean}]

### groupSortedDescending
###### boolean

### groupSortedCaseInsensitive
###### boolean

## Styling
Styling props are the quiquest way to organize your list whether in rows, responsive grids, or tables.

### Table Display
v2.0 adds support for standard HTML tables.

```jsx
<FlatList
  list={people}
  displayTable={true}
  renderTableHeader={() => (
    <tr><th>First Name</th><th>Last Name</th></tr>
  )}
  renderItem={(person) => (
    <tr key={person.id}>
      <td>{person.firstName}</td>
      <td>{person.lastName}</td>
    </tr>
  )}
  renderTableFooter={() => (
    <tr><td colSpan={2}>End of Table</td></tr>
  )}
/>
```

### displayGrid
###### boolean
Responsive grid layout with minimum 200px columns and 20px gap.

### minColumnWidth
###### string
Default is "200px".

### gridGap
###### string
Default is "20px".

### displayRow
###### boolean
Stacks all items at 100% width.

### rowGap
###### string
Spacing between rows.

## scrollToTop
Scrolling to top goes well with rendering list specially if it a long one. 

### scrollToTopButton
###### JSX.Element | () => JSX.Element

### scrollToTopOffset
###### number
Default is **50px**.

### scrollToTopPadding
###### number
Default is **20px**.

### scrollToTopPosition
###### string
Default is **"bottom right"**.

## Utilities
You may also use the internal utility functions FlatList uses:
- `sortList`
- `searchList` (with regex support)
- `filterList`
- `groupList`
- `limitList`

### Thank You
Please show your support, help make this better, suggest features, report bugs and even contribute to this 
project.

Share this project with your friends and colleages if you love it like I do.

thank you!

-- ec
