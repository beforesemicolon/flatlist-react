import React, {
  createRef,
  ReactNode,
  Ref,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  handleRenderGroupSeparator,
  handleRenderItem,
  renderFunc,
} from "./uiFunctions";

interface ScrollRendererProps<ListItem> {
  list?: any[];
  renderItem?: renderFunc<ListItem>;
  groupSeparator?:
    | ReactNode
    | ((g: any, idx: number, label: string) => ReactNode | null)
    | null;
}

function ScrollRenderer<ListItem>(props: ScrollRendererProps<ListItem>) {
  const { list = [], renderItem = () => null, groupSeparator = null } = props;
  const [render, setRender] = useState({ renderList: [], index: 0 });
  const [mounted, setMounted] = useState(false);
  const [setupCount, setSetupCount] = useState(-1);
  const containerRef: Ref<HTMLElement> = createRef();

  const renderThisItem = useMemo(
    () =>
      handleRenderItem(renderItem, handleRenderGroupSeparator(groupSeparator)),
    [renderItem, groupSeparator]
  );

  const updateRenderInfo = (count = 10) => {
    if (render.index < list.length) {
      const index = render.index + count;
      setRender({
        renderList: list.slice(0, index) as any,
        index,
      });
    }
  };

  const onScroll = (span: HTMLSpanElement) => () => {
    requestAnimationFrame(() => {
      if (span) {
        const parent = span.parentNode as HTMLElement;
        const startingPoint = parent.offsetTop + parent.offsetHeight;
        const anchorPos = span.offsetTop - parent.scrollTop;

        if (anchorPos <= startingPoint + parent.offsetHeight * 2) {
          updateRenderInfo();
        }
      }
    });
  };

  useEffect(() => {
    // when mounted
    setMounted(true);

    return () => {
      // when unmounted
      setMounted(false);
    };
  }, []);

  useLayoutEffect(() => {
    if (mounted) {
      // reset list on list change
      const span: any = containerRef.current;
      const pos = span.parentNode.scrollTop;
      const index = Math.max(render.renderList.length, setupCount);

      setRender({
        renderList: list.slice(0, index) as any,
        index,
      });

      requestAnimationFrame(() => {
        if (span && span.parentNode) {
          span.parentNode.scrollTop = pos;
        }
      });
    }
  }, [list]);

  useLayoutEffect(() => {
    const span = containerRef.current as HTMLSpanElement;
    const handleScroll = onScroll(span);
    let container: any = null;

    if (span) {
      container = span.parentNode;
      requestAnimationFrame(() => {
        // populate double the container height of items
        if (
          render.index === 0 ||
          container.scrollHeight <= container.offsetHeight * 2
        ) {
          updateRenderInfo();
        } else if (setupCount === -1) {
          setSetupCount(render.index);
        }
      });

      container.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      // when unmounted
      if (span) {
        container.removeEventListener("scroll", handleScroll, {
          passive: true,
        });
      }
    };
  }, [render.index, list.length]);

  return (
    <>
      {render.renderList.map((item, idx) => renderThisItem(item, `${idx}`))}
      <span
        ref={containerRef}
        style={{ visibility: "hidden", height: 1 }}
        className="___scroll-renderer-anchor"
      />
    </>
  );
}

export default ScrollRenderer;
