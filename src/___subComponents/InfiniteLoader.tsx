import React, {Component, createRef, CSSProperties} from 'react';
import {bool, element, func, node, oneOf, oneOfType} from 'prop-types';
import {isFunction} from '../___utils/isType';
import DefaultLoadIndicator from './DefaultLoadIndicator';

export interface InfiniteLoaderProps {
    loadingIndicator: null | (() => JSX.Element) | JSX.Element;
    loadingIndicatorPosition: string;
    hasMore: boolean;
    loadMore: null | (() => void);
}

interface State {
    scrollingContainer: HTMLElement | null;
    loadIndicatorContainer: HTMLDivElement | null;
    loading: boolean;
}

class InfiniteLoader extends Component<InfiniteLoaderProps, State> {
    static propTypes = {
        hasMore: bool.isRequired,
        loadMore: func.isRequired,
        loadingIndicator: oneOfType([func, node, element]),
        loadingIndicatorPosition: oneOf(['left', 'center', 'right', ''])
    };

    static defaultProps = {
        loadingIndicatorPosition: 'left',
        loadingIndicator: DefaultLoadIndicator
    };

    state: State = {
        loadIndicatorContainer: null,
        loading: false,
        scrollingContainer: null
    };

    loaderContainerRef = createRef<HTMLDivElement>();

    // track the last scroll position so when new dom elements are inserted to avoid scroll jump
    lastScrollTop = 0;

    mounted = false;

    // keep track of the dom items in the list
    currentItemsCount = 0;

    componentDidMount(): void {
        this.mounted = true;
        const {current: loadIndicatorContainer}: any = this.loaderContainerRef;

        if (loadIndicatorContainer) {
            this.setState({
                loadIndicatorContainer,
                scrollingContainer: loadIndicatorContainer.parentNode
            }, () => {
                this.currentItemsCount = this.getScrollingContainerChildrenCount();
                this.setupScrollingContainerEventsListener();
            });
        } else {
            console.warn('FlatList: it was not possible to get container\'s ref. '
          + 'Infinite scrolling pagination will not be possible');
        }
    }

    componentDidUpdate(prevProps: InfiniteLoaderProps, prevState: State): void {
        // reset scroll position to where last was
        if (this.state.scrollingContainer) {
            this.state.scrollingContainer.scrollTop = this.lastScrollTop;
        }

        // if prev and current loading are the same is because the component updated from props change
        // otherwise is because the component updated itself
        if (prevState.loading === this.state.loading) {
            this.reset();
        }
    }

    componentWillUnmount(): void {
        this.setupScrollingContainerEventsListener(true);
        this.mounted = false;
    }

    // update the loading flags and items count whether "hasMore" is false or list changed
    reset(): void {
        if (this.state.loading) {
            this.setState({loading: false});
        }

        this.checkIfLoadingIsNeeded();
    }

    getScrollingContainerChildrenCount = (): number => {
        const {scrollingContainer} = this.state;

        if (scrollingContainer) {
            return Math.max(0, scrollingContainer.children.length);
        }

        return 0;
    }

    setupScrollingContainerEventsListener = (removeEvent = false) => {
        const {scrollingContainer} = this.state;

        if (scrollingContainer) {
            ['scroll', 'mousewheel', 'touchmove'].forEach((event: string) => {
                if (removeEvent) {
                    scrollingContainer.removeEventListener(event, this.checkIfLoadingIsNeeded, true);
                } else {
                    scrollingContainer.addEventListener(event, this.checkIfLoadingIsNeeded, true);
                }
            });
        }
    }

    // show or hide loading indicators based on scroll position
    // calls the "loadMore" function when is needed
    checkIfLoadingIsNeeded = (): void => {
        if (!this.mounted || !this.props.hasMore || this.state.loading) {
            return;
        }

        const {scrollingContainer, loadIndicatorContainer} = this.state;
        if (scrollingContainer && loadIndicatorContainer) {
            const {scrollTop, offsetTop, clientHeight} = scrollingContainer;
            this.lastScrollTop = scrollTop;

            const loaderPosition = (loadIndicatorContainer.offsetTop - scrollTop);
            const startingPoint = offsetTop + clientHeight;

            if (loaderPosition <= startingPoint) {
                this.setState({loading: true}, this.props.loadMore as (() => void));
            }
        }
    }

    render(): JSX.Element {
        const {loading} = this.state;
        const {hasMore, loadingIndicator, loadingIndicatorPosition} = this.props;

        // do not remove the element from the dom so the ref is not broken but set it invisible enough
        const styles: CSSProperties = {
            display: 'flex',
            height: hasMore ? 'auto' : 0,
            justifyContent: loadingIndicatorPosition === 'center' ? loadingIndicatorPosition
                : loadingIndicatorPosition === 'right' ? 'flex-end' : 'flex-start',
            padding: hasMore ? '5px 0' : 0,
            visibility: (loading && hasMore) ? 'visible' : 'hidden'
        };

        return (
            <div ref={this.loaderContainerRef} className="__infinite-loader" style={styles}>
                {
                    hasMore
                    && (loadingIndicator
                        ? (isFunction(loadingIndicator) ? (loadingIndicator as () => JSX.Element)() : loadingIndicator)
                        : DefaultLoadIndicator)
                }
            </div>
        );
    }
}

export default InfiniteLoader;
