// Helper to return vertical scroll position for a container element.
// Optionally store the values in custom data attributes.
// Returns object:
//   {
//      px: Scroll position in pixels,
//      fr: Scroll position as a decimal between 0 and 1 (multiply by 100 for percentage)
//   }
export default function getScrollDataFor(elem, setAttrs = true) {
  // Pixels from top and fraction of full height scrolled (0 to 1)
  let px;
  let fr;
  let target = elem;

  if (!elem) return {};

  // Special solution when elem is document object:
  if (elem.documentElement) {
    px = window.pageYOffset;
    fr = px / (document.body.scrollHeight - window.innerHeight);
    target = elem.documentElement;
  } else {
    px = elem.scrollTop;
    fr = px / (elem.scrollHeight - elem.offsetHeight);
  }

  if (setAttrs && target.setAttribute) {
    target.setAttribute('data-scrolly-px', px);
    target.setAttribute('data-scrolly-pc', (100 * fr).toFixed(0));
  }

  return { px, fr };
}
