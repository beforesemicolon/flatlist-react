<div align="center">
  <br>
  <img src="documentation/logo.svg" alt="FlatList React Logo" width="160" />
  <h1 style="margin: 0 0 10px;"">FlatList React</h1>
  <p><b>The ultimate utility for rendering lists in React with zero boilerplate.</b></p>

  [![Build](https://github.com/beforesemicolon/flatlist-react/workflows/Node.js%20CI/badge.svg)](https://github.com/beforesemicolon/flatlist-react/actions)
  [![GitHub license](https://img.shields.io/github/license/beforesemicolon/flatlist-react)](https://github.com/beforesemicolon/flatlist-react/blob/master/LICENSE)
  [![npm version](https://img.shields.io/npm/v/flatlist-react)](https://www.npmjs.com/package/flatlist-react)
  [![npm downloads](https://img.shields.io/npm/dm/flatlist-react)](https://www.npmjs.com/package/flatlist-react)
</div>

---

FlatList React is a powerful, lightweight component designed to handle common list rendering tasks like **grouping**, **sorting**, **filtering**, **searching**, and **infinite scrolling** through simple, declarative props.

### 🚀 What's New in v2.0
- **React 19 Ready:** Fully modernized with standard `ref` prop support and React Compiler optimizations.
- **Inverted Mode:** Native support for chat-like interfaces (scroll-to-top pagination).
- **Regex Search:** Advanced search capabilities with safe Regular Expression support.
- **Table Display:** Semantic `<table>` rendering with custom headers and footers.
- **Advanced Grouping:** Added `renderGroupHeader` and `renderGroupFooter` for deep list customization.
- **Deep Scroll Ancestors:** Target any scrolling parent with `scrollingContainerId`.

---

### 📦 Installation

v2.x requires **React 19.0.0+**. For older React versions, please use v1.x.

```bash
npm install flatlist-react
```

### 🛠️ Quick Start

```tsx
import FlatList from 'flatlist-react';

const PeopleList = ({ people }) => (
  <FlatList
    list={people}
    renderItem={(person, key) => (
      <li key={key}>
        {person.firstName} {person.lastName}
      </li>
    )}
    renderWhenEmpty={() => <div>List is empty!</div>}
    sortBy={["firstName", { key: "lastName", descending: true }]}
    groupBy={person => person.info.age > 18 ? 'Over 18' : 'Under 18'}
    // Search with Regex support!
    searchTerm="^John" 
    searchBy="firstName"
  />
);
```

### 📖 Full Documentation

| Topic | Features Covered |
| :--- | :--- |
| **[Rendering](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#rendering)** | List extraction, `renderItem`, Empty states, `limit`, `reversed`, `inverted` |
| **[Pagination](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#pagination)** | Infinite Scroll, `hasMoreItems`, `loadMoreItems`, `scrollingContainerId` |
| **[Searching](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#searching)** | **Regex Search**, multiple keys, case-insensitivity, `onEveryWord` |
| **[Grouping](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#grouping)** | **Group Headers & Footers**, multi-level sorting, custom separators |
| **[Styling](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#styling)** | **Table Mode**, Responsive Grids, Flex Rows, Custom Gaps |
| **[Utilities](https://github.com/beforesemicolon/flatlist-react/blob/master/documentation/Doc.md#utilities)** | Use internal logic for non-React projects: `sortList`, `searchList`, etc. |

---

### ⚠️ Note for React Native Developers
This library is optimized for **Web (DOM)** and utilizes standard HTML elements. While some features may work in React Native, it is not officially supported and may cause crashes or layout issues.

### 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  Developed with ❤️ by <a href="https://github.com/beforesemicolon">Elson T. Correia</a>
</div>
