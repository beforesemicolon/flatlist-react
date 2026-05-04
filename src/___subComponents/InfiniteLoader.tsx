import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { isFunction } from "../___utils/isType";
import DefaultLoadIndicator from "./DefaultLoadIndicator";

export interface InfiniteLoaderInterface {
  loadingIndicator?: null | (() => ReactNode) | ReactNode;
  loadingIndicatorPosition?: string;
  hasMore: boolean;
  loadMore: null | (() => void);
  scrollingContainerId?: string;
  inverted?: boolean;
}

interface InfiniteLoaderProps extends InfiniteLoaderInterface {
  itemsCount: number;
  scrollingContainerId?: string;
  inverted?: boolean;
}

const InfiniteLoader = (props: InfiniteLoaderProps) => {
  const {
    loadMore,
    hasMore,
    loadingIndicator = DefaultLoadIndicator,
    loadingIndicatorPosition = "left",
    itemsCount,
    scrollingContainerId,
    inverted = false,
  } = props;

  const [loading, setLoading] = useState(false);
  const [prevItemsCount, setPrevItemsCount] = useState(itemsCount);

  if (itemsCount !== prevItemsCount) {
    setPrevItemsCount(itemsCount);
    setLoading(false);
  }

  const loaderContainerRef = useRef<HTMLDivElement>(null);
  const scrollingContainerRef = useRef<HTMLElement | null>(null);
  const lastScrollTop = useRef(0);
  const lastScrollHeight = useRef(0);
  const mounted = useRef(false);

  const checkIfLoadingIsNeeded = useCallback(() => {
    const loader = loaderContainerRef.current;
    const scrollingContainer = scrollingContainerRef.current;

    if (loader && scrollingContainer) {
      if (!mounted.current || !hasMore || loading) {
        return;
      }

      const { scrollTop, offsetTop, offsetHeight } = scrollingContainer;

      if (inverted) {
        if (scrollTop <= 50) {
          setLoading(true);
          if (loadMore) {
            (loadMore as () => void)();
          }
        }
        return;
      }

      const loaderPosition = loader.offsetTop - scrollTop;
      const startingPoint = offsetTop + offsetHeight;

      if (loaderPosition <= startingPoint) {
        setLoading(true);
        if (loadMore) {
          (loadMore as () => void)();
        }
      }
    }
  }, [hasMore, loading, loadMore, inverted]);

  useEffect(() => {
    mounted.current = true;
    const loader = loaderContainerRef.current;
    if (loader) {
      let container = loader.parentNode as HTMLElement;

      if (scrollingContainerId) {
        container = container.closest(
          `#${scrollingContainerId}`,
        ) as HTMLElement;

        if (!container) {
          throw new Error(
            `Can't find scrolling container with id of "${scrollingContainerId}"`,
          );
        }
      }

      scrollingContainerRef.current = container;
      lastScrollTop.current = container.scrollTop;
      lastScrollHeight.current = container.scrollHeight;

      const events = ["scroll", "mousewheel", "touchmove"];
      events.forEach((event) => {
        container.addEventListener(event, checkIfLoadingIsNeeded, true);
      });

      return () => {
        mounted.current = false;
        events.forEach((event) => {
          container.removeEventListener(event, checkIfLoadingIsNeeded, true);
        });
      };
    }
    return () => {
      mounted.current = false;
    };
  }, [checkIfLoadingIsNeeded, scrollingContainerId]);

  useLayoutEffect(() => {
    // reset scroll position to where last was
    if (scrollingContainerRef.current) {
      if (inverted) {
        const newScrollHeight = scrollingContainerRef.current.scrollHeight;
        const delta = newScrollHeight - lastScrollHeight.current;
        if (delta !== 0) {
          scrollingContainerRef.current.scrollTop =
            lastScrollTop.current + delta;
        }
      } else {
        scrollingContainerRef.current.scrollTop = lastScrollTop.current;
      }
    }
    // Update refs AFTER potential adjustment
    if (scrollingContainerRef.current) {
      lastScrollTop.current = scrollingContainerRef.current.scrollTop;
      lastScrollHeight.current = scrollingContainerRef.current.scrollHeight;
    }
  }, [itemsCount, inverted]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollingContainerRef.current) {
        lastScrollTop.current = scrollingContainerRef.current.scrollTop;
        lastScrollHeight.current = scrollingContainerRef.current.scrollHeight;
      }
    };

    const container = scrollingContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, true);
      return () => {
        container.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, []);

  useEffect(() => {
    checkIfLoadingIsNeeded();
  });

  const spinning = hasMore && loading;

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

  const loadingEl: any = isFunction(loadingIndicator)
    ? (loadingIndicator as () => ReactNode)()
    : loadingIndicator;

  return (
    <div ref={loaderContainerRef} className="__infinite-loader" style={styles}>
      {spinning && (loadingIndicator ? loadingEl : <DefaultLoadIndicator />)}
    </div>
  );
};

InfiniteLoader.displayName = "InfiniteLoader";

export default InfiniteLoader;
