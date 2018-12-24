import { Component, Event, EventEmitter } from '@stencil/core';
import debounce from '../../common/utils/events/debounce';

// Lookups of classnames for each breakpoint:
// It will look something like this after being populated:
// {
//   lg: '1200px';
//   md: '992px';
//   sm: '768px';
//   xs: '320px';
// }
let breakpointSizesLookup;

// Lookups of classnames for each breakpoint:
// It will look something like this after being populated:
// {
//   xs: 'xs lte-xs lte-sm lte-md lte-lg gte-xs',
//   sm: 'sm lte-sm lte-md lte-lg gte-xs gte-sm',
//   md: 'md lte-md lte-lg gte-xs gte-sm gte-md',
//   lg: 'lg lte-lg gte-xs gte-sm gte-md gte-lg'
// }
let breakpointClassesLookup;

// Cache a reference to commonly used elements to improve performance:
const head = document.head;
const root = document.documentElement;

// Detect browser support for requestIdleCallback or revert to fallback for IE11 etc:
const requestIdleCallback = 'requestIdleCallback' in window ? 'requestIdleCallback' : 'setTimeout';

// Keep track of previous breakpoint so we can test when it changes:
let prevBreakpoint: string;

// Generate helper classes to populate breakpointClassesLookup[]:
function generateBreakpointClassesLookup(index: number, allNames: string[]): string {
  let lte = '';
  let gte = '';
  let i = allNames.length;

  while (i--) {
    const next = allNames[i];
    if (index <= i) lte = ' lte-' + next + lte;
    if (index >= i) gte = ' gte-' + next + gte;
  }

  return allNames[index] + lte + gte;
}

function onResize() {
  // Extract name of current breakpoint passed from global css via <head> font-family hack:
  // Eg: head { font-family: xs, "xs|sm|md|lg", "320px|768px|992px|1200px"; }
  // The 1st value is current breakpoint, 2nd is breakpoint names, 3rd is breakpoint sizes.
  const breakpointsConfig = window
    .getComputedStyle(head)
    .fontFamily.replace(/"|\s/gi, '')
    .split(',');

  // Extract current breakpoint name, eg "xs":
  const nextBreakpoint = breakpointsConfig.shift();

  // Populate breakpointClassesLookup the first time onResize is called:
  if (!breakpointClassesLookup) {
    const allSizes = breakpointsConfig.pop().split('|');
    const allNames = breakpointsConfig.pop().split('|');
    let i = allNames.length;

    breakpointSizesLookup = {};
    breakpointClassesLookup = {};

    while (i--) {
      const name = allNames[i];
      breakpointSizesLookup[name] = allSizes[i];
      breakpointClassesLookup[name] = generateBreakpointClassesLookup(i, allNames);
    }
  }

  // Only proceed if the breakpoint has changed:
  if (nextBreakpoint !== prevBreakpoint) {
    const nextClasses = nextBreakpoint && breakpointClassesLookup[nextBreakpoint];

    if (nextClasses) {
      const prevClasses = prevBreakpoint && breakpointClassesLookup[prevBreakpoint];

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
  onResize = debounce(onResize, 100, this);

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
