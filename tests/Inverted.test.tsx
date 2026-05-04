import { cleanup, render, fireEvent } from "@testing-library/react";
import React from "react";
import FlatList from "../src/flatlist-react";

describe("FlatList Inverted", () => {
  afterEach(cleanup);

  it("Should trigger loadMore when scrolling to the top in inverted mode", () => {
    const loadMore = jest.fn();
    const list = [1, 2, 3, 4, 5];

    const { container } = render(
      <div
        id="scrolling-container"
        style={{ height: "100px", overflow: "auto" }}
      >
        <FlatList
          list={list}
          renderItem={(item) => <div key={item} style={{ height: "50px" }}>{item}</div>}
          hasMoreItems={true}
          loadMoreItems={loadMore}
          inverted={true}
          scrollingContainerId="scrolling-container"
        />
      </div>
    );

    const scrollingContainer = container.firstChild as HTMLElement;
    
    // Initial state: loader should be at the top
    expect(container.querySelector(".__infinite-loader")).toBeDefined();

    // Mock dimensions for JSDOM
    Object.defineProperty(scrollingContainer, "offsetHeight", { value: 100 });
    Object.defineProperty(scrollingContainer, "scrollHeight", { value: 300 });

    // Set initial scroll to bottom so it doesn't trigger on mount
    scrollingContainer.scrollTop = 200;

    // Scroll to top (trigger)
    fireEvent.scroll(scrollingContainer, { target: { scrollTop: 10 } });
    
    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it("Should maintain relative scroll position when items are added in inverted mode", () => {
    const list = [3, 4, 5];
    const { container, rerender } = render(
      <div
        id="scrolling-container-2"
        style={{ height: "100px", overflow: "auto" }}
      >
        <FlatList
          list={list}
          renderItem={(item) => <div key={item} style={{ height: "50px" }}>{item}</div>}
          hasMoreItems={true}
          loadMoreItems={() => {}}
          inverted={true}
          scrollingContainerId="scrolling-container-2"
        />
      </div>
    );

    const scrollingContainer = container.firstChild as HTMLElement;
    
    // Mock dimensions
    Object.defineProperty(scrollingContainer, "offsetHeight", { value: 100 });
    // 3 items * 50px = 150px
    Object.defineProperty(scrollingContainer, "scrollHeight", { value: 150, configurable: true });

    // Scroll to 20px
    scrollingContainer.scrollTop = 20;
    fireEvent.scroll(scrollingContainer);

    // Rerender with 2 more items at the top
    const newList = [1, 2, 3, 4, 5];
    // 5 items * 50px = 250px
    Object.defineProperty(scrollingContainer, "scrollHeight", { value: 250, configurable: true });
    
    rerender(
      <div
        id="scrolling-container-2"
        style={{ height: "100px", overflow: "auto" }}
      >
        <FlatList
          list={newList}
          renderItem={(item) => <div key={item} style={{ height: "50px" }}>{item}</div>}
          hasMoreItems={true}
          loadMoreItems={() => {}}
          inverted={true}
          scrollingContainerId="scrolling-container-2"
        />
      </div>
    );

    // New scrollTop should be oldScrollTop + (newScrollHeight - oldScrollHeight)
    // 20 + (250 - 150) = 120
    expect(scrollingContainer.scrollTop).toBe(120);
  });
});
