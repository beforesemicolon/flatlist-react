<h1
style="
color: #666;
background-color: #f2f2f2;
padding: 10px 20px;
">
FlatList React
</h1>

A helpful react utility component intended to simplify handling rendering list with ease.
It can handle `grouping`, `sorting`, `filtering`, `searching`, `sorting`, `paginating`, `styling` with very simple props.

---

###### Dear React Native Developer
This is not intended for React-Native usage. Although some features will still work, others will just break your application. Use at your own risk.

### Install

Make sure you are running **react** and **react-dom** version **16.8.0+**.

```npm install flatlist-react```

### Quick Start

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

Now inside your component file, we create a function `renderPerson` that will be passed to `renderItem`:

```tsx
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

```tsx
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

`renderWhenEmpty` is a powerful prop that you can use to render things in case a user applied filters or searched and nothing matched. Please check the full documentation for great examples and more powerful props.

### Full Documentation

| Features        | Props / Components        |
| :------------- | :------------- |
| [Components](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#complementary)  | [PlainList](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#plainlist) |
| [Rendering](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#rendering)      | [list](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#list), [renderItem](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#renderitem), [renderWhenEmpty](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#renderwhenempty), [wrapperHtmlTag](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#wrapperhtmltag), [limit](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#limit), [reversed](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#reversed) |
| [Render Optimization](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#renderoptimization) | [renderOnScroll](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#renderonscroll) |
| [Pagination (Infinite Scroll)](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#pagination)   | [hasMoreItems](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#hasmoreitems), [loadMoreItems](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#loadmoreitems), [paginationLoadingIndicator](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#paginationloadingindicator), [paginationLoadingIndicatorPosition](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#paginationloadingindicatorposition) |
| [Filtering](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#filtering) | [filterBy](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#filterby) |
| [Searching](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#searching) | [search](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#search) ([searchTerm](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#searchterm), [searchBy](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#searchby), [searchOnEveryWord](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#searchoneveryword), [searchMinCharactersCount](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#searchmincharacterscount), [searchCaseInsensitive](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#searchcaseinsensitive))    |
| [Sorting](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#sorting)  | [sort](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#sort) ([sortBy](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#sortby), [sortCaseInsensitive](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#sortcaseinsensitive), [sortDescending](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#sortdescending))     |
| [Grouping](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#grouping) | [group](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#group) ([groupOf](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#groupof), [groupBy](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#groupby), [groupSeparator](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#groupseparator), [groupSeparatorAtTheBottom](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#groupseparatoratthebottom), [groupReversed](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#groupreversed), [groupSorted](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#groupsorted), [groupSortedBy](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#groupsortedby), [groupSortedDescending](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#groupsorteddescendiing), [groupSortedCaseInsensitive](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#groupsortedcaseinsensitive)) |
| [Styling](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#styling) | [display](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#display) ([displayGrid](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#displaygrid), [gridGap](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#gridgap), [minColumnWidth](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#mincolumnwidth), [displayRow](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#displayrow), [rowGap](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#rowgap))     |
| [scrollToTop](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#scrolltotop) |[scrollToTopButton](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#scrolltotopbutton), [scrollToTopOffset](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#scrolltotopoffset), [scrollToTopPadding](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#scrolltotoppadding), [scrollToTopPosition](https://github.com/ECorreia45/flatlist-react/tree/documentation/documentation#scrolltotopposition) |
