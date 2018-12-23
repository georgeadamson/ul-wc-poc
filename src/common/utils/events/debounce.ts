/**
 * Debounce
 * Inspired by: http://modernjavascript.blogspot.com/2013/08/building-better-debounce.html
 * Note: This code is smaller than using "import debounce from 'lodash/debounce'" but has less features.
 */
export default function debounce(func: Function, wait: number = 50, context = this) {
  // we need to save these in the closure
  var timeout, timestamp;

  return function(...args) {
    // save details of latest call

    timestamp = new Date();

    // this is where the magic happens
    var later = function() {
      // how long ago was the last call?
      var last = (new Date() as any) - timestamp;

      // if the latest call was less that the wait period ago
      // then we reset the timeout to wait for the difference
      if (last < wait) {
        timeout = setTimeout(later, wait - last);

        // or if not we can null out the timer and run the latest
      } else {
        timeout = null;
        func.apply(context, args);
      }
    };

    // we only need to set the timer now if one isn't already running
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
  };
}
