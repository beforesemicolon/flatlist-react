import { cleanup, render } from "@testing-library/react";
import React from "react";
import FlatList from "../src/flatlist-react";

describe("FlatList Issues #71 and #72", () => {
  afterEach(cleanup);

  it("Should render group header and footer (Issue #71)", () => {
    const list = [
        { name: "A1", group: "A" },
        { name: "A2", group: "A" },
        { name: "B1", group: "B" },
    ];

    const { getByText } = render(
        <FlatList
            list={list}
            renderItem={(item: any) => <div key={item.name}>{item.name}</div>}
            groupBy="group"
            renderGroupHeader={(label, items) => <div data-testid="header">{label} ({items.length})</div>}
            renderGroupFooter={(label, items) => <div data-testid="footer">End of {label}</div>}
        />
    );

    expect(getByText("A (2)")).toBeDefined();
    expect(getByText("End of A")).toBeDefined();
    expect(getByText("B (1)")).toBeDefined();
    expect(getByText("End of B")).toBeDefined();
  });

  it("Should render as a table (Issue #72)", () => {
    const list = [
        { id: 1, val: "Item 1" },
        { id: 2, val: "Item 2" },
    ];

    const { container } = render(
        <FlatList
            list={list}
            displayTable={true}
            renderTableHeader={() => <tr><th>ID</th><th>Value</th></tr>}
            renderItem={(item: any) => <tr key={item.id}><td>{item.id}</td><td>{item.val}</td></tr>}
            renderTableFooter={() => <tr><td colSpan={2}>Footer</td></tr>}
        />
    );

    const table = container.querySelector("table");
    expect(table).toBeDefined();
    expect(table?.querySelector("thead")).toBeDefined();
    expect(table?.querySelector("tbody")).toBeDefined();
    expect(table?.querySelector("tfoot")).toBeDefined();
    expect(container.textContent).toContain("IDValue");
    expect(container.textContent).toContain("Item 1");
    expect(container.textContent).toContain("Footer");
  });
});
