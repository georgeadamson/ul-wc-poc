// Helper to disable scrolling on body by toggling "overflow-y:hidden" style:
export default function togglePageNoScroll(noScroll: boolean, uid: string) {
  let styleTag;
  const doc = document;
  const id = "noscroll-for-" + (uid || "ANY");

  if (noScroll) {
    // Add a custom style element to enforce overflow-y:hidden:
    styleTag = doc.createElement("style");
    styleTag.id = id;
    styleTag.innerText =
      "html,body{overflow-y:hidden!important;overscroll-behavior:none!important}";
    doc.head.appendChild(styleTag);
  } else {
    // Remove our custom style element:
    styleTag = doc.getElementById(id);
    if (styleTag) {
      doc.head.removeChild(styleTag);
    }
  }
}
