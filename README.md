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

[![Build](https://github.com/beforesemicolon/flatlist-react/workflows/Node.js%20CI/badge.svg)](https://github.com/beforesemicolon/flatlist-react/actions)
[![GitHub](https://img.shields.io/github/license/beforesemicolon/flatlist-react)](https://github.com/beforesemicolon/flatlist-react/blob/master/LICENSE)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/beforesemicolon/flatlist-react)](https://www.npmjs.com/package/flatlist-react)

---

###### Dear React Native Developer
This is not intended for React-Native usage. Although some features will still work, others will just break your application. Use at your own risk.

### Install

Make sure you are running **react** and **react-dom** version **16.8.0+**.

```npm install flatlist-react```

### How to use

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
          renderItem={this.renderPerson}
          renderWhenEmpty={() => <div>List is empty!</div>}
          sortBy={["firstName", {key: "lastName", descending: true}]}
          groupBy={person => person.info.age > 18 ? 'Over 18' : 'Under 18'}
        />
    </ul>
)
```
### Full Documentation

| Features                                                                                                                      | Props / Components                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|:------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Rendering](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#rendering)                     | [list](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#list-and-renderitem), [renderItem](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#list-and-renderitem), [renderWhenEmpty](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#renderwhenempty), [wrapperHtmlTag](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#wrapperhtmltag), [limit](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#limit), [reversed](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#reversed)                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [Render Optimization](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#render-optimization) | [renderOnScroll](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#renderonscroll)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [Pagination (Infinite Scroll)](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#pagination) | [hasMoreItems](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#hasmoreitems), [loadMoreItems](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#loadmoreitems), [paginationLoadingIndicator](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#paginationloadingindicator), [paginationLoadingIndicatorPosition](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#paginationloadingindicatorposition)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [Filtering](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#filtering)                     | [filterBy](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#filterby)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| [Searching](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#searching)                     | [searchTerm](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#searchterm), [searchBy](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#searchby), [searchOnEveryWord](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#searchoneveryword), [searchMinCharactersCount](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#searchmincharacterscount), [searchCaseInsensitive](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#searchcaseinsensitive)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [Sorting](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#sorting)                         | [sortBy](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#sortby), [sortCaseInsensitive](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#sortcaseinsensitive), [sortDescending](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#sortdescending)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| [Grouping](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#grouping)                       | [groupOf](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#groupof), [groupBy](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#groupby), [groupSeparator](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#groupseparator), [groupSeparatorAtTheBottom](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#groupseparatoratthebottom), [groupReversed](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#groupreversed), [groupSorted](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#groupsorted), [groupSortedBy](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#groupsortedby), [groupSortedDescending](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#groupsorteddescending), [groupSortedCaseInsensitive](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#groupsortedcaseinsensitive) |
| [Styling](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#styling)                         | [displayGrid](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#displaygrid), [gridGap](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#gridgap), [minColumnWidth](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#mincolumnwidth), [displayRow](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#displayrow), [rowGap](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#rowgap)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [scrollToTop](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#scrolltotop)                 | [scrollToTopButton](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#scrolltotopbutton), [scrollToTopOffset](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#scrolltotopoffset), [scrollToTopPadding](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#scrolltotoppadding), [scrollToTopPosition](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#scrolltotopposition)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [Components](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#components)                   | [PlainList](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#plainlist)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| [Utilities](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#utilities)                     | [sortList](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#sortlist), [searchList](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#searchlist), [filterList](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#filterlist), [groupList](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#grouplist), [limitList](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#limitlist)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
