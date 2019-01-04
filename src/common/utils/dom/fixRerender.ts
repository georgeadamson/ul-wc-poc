// Smelly hack to un-nest a Component's child elements
// if the component is being re-rendered.
// Without this, if the first render modified children,
// then the next render may modify the modified children 😱
export default function fixRerender(host: HTMLElement, isUnwantedChild: Function) {
  Array.from(host.childNodes).forEach(elem => {
    if (isUnwantedChild(elem)) {
      const parent: Node = elem.parentNode;
      let nextChild: Node;

      // Move children from element to parent before deleting element:
      while ((nextChild = elem.firstChild)) {
        if (isUnwantedChild(nextChild)) {
          elem.removeChild(nextChild);
        } else {
          parent.insertBefore(nextChild, elem);
        }
      }

      parent.removeChild(elem);
    }
  });
}
