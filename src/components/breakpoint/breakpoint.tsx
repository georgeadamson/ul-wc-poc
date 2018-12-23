import { Component, Event, EventEmitter } from '@stencil/core';
import debounce from '../../common/utils/events/debounce';

// Lookup of classnames for each breakpoint:
// TODO: Derive this lookup from CSS.
const breakpointClassesFor = {
  xs: 'xs lte-xs lte-sm lte-md lte-lg gte-xs',
  sm: 'sm lte-sm lte-md lte-lg gte-xs gte-sm',
  md: 'md lte-md lte-lg gte-xs gte-sm gte-md',
  lg: 'lg lte-lg gte-xs gte-sm gte-md gte-lg'
};

// Cache a reference to commonly used elements to improve performance:
const head = document.head;
const root = document.documentElement;

// Detect browser support for requestIdleCallback or revert to fallback for IE11 etc:
const requestIdleCallback = 'requestIdleCallback' in window ? 'requestIdleCallback' : 'setTimeout';

// Keep track of previous breakpoint so we can test when it changes:
let prevBreakpoint: string;

function onResize() {
  const nextBreakpoint = window.getComputedStyle(head).fontFamily;

  // Only proceed if the breakpoint has changed:
  if (nextBreakpoint !== prevBreakpoint) {
    const nextClasses = nextBreakpoint && breakpointClassesFor[nextBreakpoint];

    if (nextClasses) {
      const prevClasses = prevBreakpoint && breakpointClassesFor[prevBreakpoint];

      // Prepare function to run as soon as possible, to update css classes and raise event:
      const updateBreakpointClasses = () => {
        const breakpointEvent = this.breakpoint;

        // For performance we modify className directly instead of using classList.
        // This technique allows us to change multiple classNames with one DOM update.
        // Beware! It's fast but will fail if another script changes the order of the breakpoint classnames.
        // (Besides, IE11 does not handle multiple arguments for add() or remove() anyway.)
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/classList#Browser_compatibility

        // Toggle breakpoint helper classes on the <html> element:
        if (prevClasses) root.className = root.className.replace(prevClasses, nextClasses);
        // The following is only needed once, to initialise the breakpoint classes:
        else root.className += ' ' + nextClasses;

        // Raise custom event to inform listeners of the change:
        if (breakpointEvent && breakpointEvent.emit) {
          breakpointEvent.emit(nextBreakpoint, prevBreakpoint);
        }
      };

      // Experimental performance technique. Is it smoother than just running the code immediately?
      window[requestIdleCallback](updateBreakpointClasses);
    }

    prevBreakpoint = nextBreakpoint;
  }
}

@Component({
  tag: 'aup-breakpoint'
})
export class MyComponent {
  /**
   * This component emits a breakpoint events whenever CSS breakpoint has changed:
   */
  @Event() breakpoint: EventEmitter;

  // Debounced event handler with "this" context:
  onResize = debounce(onResize.bind(this), 100);

  componentWillLoad() {
    onResize.call(this);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
  }

  componentDidUnload() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('orientationchange', this.onResize);
  }
}
