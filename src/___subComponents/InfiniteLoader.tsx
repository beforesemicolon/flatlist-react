import React, { Component, createRef, CSSProperties, ReactNode } from "react";
import { isFunction } from "../___utils/isType";
import DefaultLoadIndicator from "./DefaultLoadIndicator";

export interface InfiniteLoaderInterface {
  loadingIndicator?: null | (() => ReactNode) | ReactNode;
  loadingIndicatorPosition?: string;
  hasMore: boolean;
  loadMore: null | (() => void);
}

interface InfiniteLoaderState {
  scrollingContainer: HTMLElement | null;
  loadIndicatorContainer: HTMLDivElement | null;
  loading: boolean;
  prevItemsCount: number;
}

interface InfiniteLoaderProps extends InfiniteLoaderInterface {
  itemsCount: number;
}

class InfiniteLoader extends Component<
  InfiniteLoaderProps,
  InfiniteLoaderState
> {
  state: InfiniteLoaderState = {
    prevItemsCount: this.props.itemsCount,
    loadIndicatorContainer: null,
    loading: false,
    scrollingContainer: null,
  };

  loaderContainerRef = createRef<HTMLDivElement>();

  // track the last scroll position so when new dom elements are inserted to avoid scroll jump
  lastScrollTop = 0;

  mounted = false;

  // keep track of the dom items in the list
  currentItemsCount = 0;

  componentDidMount(): void {
    this.mounted = true;
    const { current: loadIndicatorContainer } = this.loaderContainerRef;

    if (loadIndicatorContainer) {
      this.setState(
        {
          loadIndicatorContainer,
          scrollingContainer: loadIndicatorContainer.parentNode as HTMLElement,
        },
        () => {
          this.currentItemsCount = this.getScrollingContainerChildrenCount();
          this.setupScrollingContainerEventsListener();
        }
      );
    } else {
      console.warn(
        "FlatList: it was not possible to get container's ref. " +
          "Infinite scrolling pagination will not be possible"
      );
    }
  }

  componentDidUpdate(
    prevProps: InfiniteLoaderProps,
    prevState: InfiniteLoaderState
  ): void {
    // reset scroll position to where last was
    if (this.state.scrollingContainer) {
      this.state.scrollingContainer.scrollTop = this.lastScrollTop;
    }

    // reset loading state when the list size changes
    if (prevProps.itemsCount !== this.props.itemsCount) {
      this.reset();
    }

    this.checkIfLoadingIsNeeded();
  }

  componentWillUnmount(): void {
    this.setupScrollingContainerEventsListener(true);
    this.mounted = false;
  }

  // update the loading flags and items count whether "hasMore" is false or list changed
  reset(): void {
    this.setState({ loading: false });
  }

  getScrollingContainerChildrenCount = (): number => {
    const { scrollingContainer } = this.state;

    if (scrollingContainer) {
      return Math.max(0, scrollingContainer.children.length);
    }

    return 0;
  };

  setupScrollingContainerEventsListener = (removeEvent = false) => {
    const { scrollingContainer } = this.state;

    if (scrollingContainer) {
      ["scroll", "mousewheel", "touchmove"].forEach((event: string) => {
        scrollingContainer.removeEventListener(
          event,
          this.checkIfLoadingIsNeeded,
          true
        );

        if (!removeEvent) {
          scrollingContainer.addEventListener(
            event,
            this.checkIfLoadingIsNeeded,
            true
          );
        }
      });
    }
  };

  // show or hide loading indicators based on scroll position
  // calls the "loadMore" function when is needed
  checkIfLoadingIsNeeded = (): void => {
    if (!this.mounted || !this.props.hasMore || this.state.loading) {
      return;
    }

    const { scrollingContainer, loadIndicatorContainer } = this.state;
    if (scrollingContainer && loadIndicatorContainer) {
      const { scrollTop, offsetTop, offsetHeight } = scrollingContainer;
      this.lastScrollTop = scrollTop;

      const loaderPosition = loadIndicatorContainer.offsetTop - scrollTop;
      const startingPoint = offsetTop + offsetHeight;

      if (loaderPosition <= startingPoint) {
        this.setState(
          { prevItemsCount: this.props.itemsCount, loading: true },
          () => {
            (this.props.loadMore as () => void)();
          }
        );
      }
    }
  };

  render(): ReactNode {
    const { loading } = this.state;
    const {
      hasMore,
      loadingIndicator = DefaultLoadIndicator,
      loadingIndicatorPosition = "left",
    } = this.props;

    const spinning = hasMore && loading;

    // do not remove the element from the dom so the ref is not broken but set it invisible enough
    const styles: CSSProperties = {
      display: "flex",
      height: spinning ? "auto" : 0,
      justifyContent:
        loadingIndicatorPosition === "center"
          ? loadingIndicatorPosition
          : loadingIndicatorPosition === "right"
          ? "flex-end"
          : "flex-start",
      padding: spinning ? "5px 0" : 0,
      visibility: spinning ? "visible" : "hidden",
    };

    const loadingEl = isFunction(loadingIndicator)
      ? (loadingIndicator as () => ReactNode)()
      : (loadingIndicator as ReactNode);

    return (
      <div
        ref={this.loaderContainerRef}
        className="__infinite-loader"
        style={styles}
      >
        {spinning && (loadingIndicator ? loadingEl : <DefaultLoadIndicator />)}
      </div>
    );
  }
}

export default InfiniteLoader;
