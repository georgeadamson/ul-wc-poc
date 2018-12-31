// Helper to disable scrolling by toggling "overflow-y:hidden" style:
// Default to block scrolling on body but you can specify a selector for a specific scroll container.
export default function toggleScrollInhibitor(
  noScroll: boolean,
  uid: string,
  containerSelector: string = 'html,body'
) {
  let styleTag: HTMLElement;
  const doc = document;
  const id = 'noscroll-for-' + (uid || containerSelector);

  if (noScroll) {
    // Add a custom style element to enforce overflow-y:hidden:
    styleTag = doc.createElement('style');
    styleTag.id = id;
    styleTag.innerText =
      containerSelector + '{overflow-y:hidden!important;overscroll-behavior:none!important}';
    doc.head.appendChild(styleTag);
  } else {
    // Remove our custom style element:
    if ((styleTag = doc.getElementById(id))) {
      doc.head.removeChild(styleTag);
    }
  }
}
