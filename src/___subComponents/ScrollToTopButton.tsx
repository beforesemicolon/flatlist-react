import React, { createRef, ReactNode, Ref, useEffect, useState } from "react";
import { isFunction } from "../___utils/isType";
import { btnPosition } from "./uiFunctions";

interface ScrollToTopButtonProps {
  button?: ReactNode | (() => ReactNode);
  position?: string;
  offset?: number;
  padding?: number;
  scrollingContainer: Ref<HTMLElement> | undefined;
}

function ScrollToTopButton(props: ScrollToTopButtonProps) {
  const anchor: Ref<HTMLElement> = createRef();
  const {
    button = null,
    position = "bottom right",
    padding = 20,
    offset = 50,
    scrollingContainer,
  } = props;
  const btn = isFunction(button) ? (button as () => ReactNode)() : button;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const buttonElement = (anchor as any).current.nextElementSibling;
    const container = (anchor as any).current.parentNode;
    const scrollContainer = (scrollingContainer as any).current;
    const containerStyle = getComputedStyle(container);
    const ogPos = containerStyle.position;
    container.style.position = ["absolute", "fixed", "relative"].includes(ogPos)
      ? ogPos
      : "relative";
    const positionBtn = btnPosition(scrollContainer, buttonElement);
    const pos = position.split(" ");
    const updateBtnPosition = () =>
      positionBtn(pos[0], pos[1], padding, offset);

    window.addEventListener("resize", updateBtnPosition);

    scrollContainer.addEventListener("scroll", updateBtnPosition);

    buttonElement.addEventListener("click", () => {
      scrollContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    setTimeout(() => updateBtnPosition(), 250);

    setMounted(true);
    return () => {
      container.style.position = ogPos;
      window.removeEventListener("resize", updateBtnPosition);
    };
  }, []);

  return (
    <>
      {!mounted && <span ref={anchor} style={{ display: "none" }} />}
      {button ? btn : <button type="button">To Top</button>}
    </>
  );
}

export default ScrollToTopButton;
