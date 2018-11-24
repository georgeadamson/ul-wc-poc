import { Component, Prop, Element, Event, EventEmitter } from "@stencil/core";

import createUid from "../../common/utils/dom/createUid";
import getScrollDataFor from "../../common/utils/dom/getScrollDataFor";

// Handler for element scroll event.
// Must be bound to a "this" context before use.
function onScroll(e) {
  const self = this;
  const target = e.target;

  // Only proceed if not waiting for Animation Frame:
  if (
    !self.waiting &&
    target &&
    (target.documentElement ||
      (target.matches && target.matches(self.watch)) ||
      document.documentElement)
  ) {
    // Adapted from http://www.html5rocks.com/en/tutorials/speed/animations/
    requestAnimationFrame(function() {
      // Event target may be the document or a specific element:
      const container =
        target.documentElement ||
        (target.setAttribute && target) ||
        document.documentElement;
      const scrollData = (self.data[container.id] = getScrollDataFor(target));
      const fr = scrollData.fr;

      container.setAttribute("data-scrolly-px", scrollData.px);
      container.setAttribute("data-scrolly-pc", 100 * fr.toFixed(2));

      // We've finished waiting for Animation Frame:
      self.waiting = false;

      // Raise custom scroll event:
      self.scrollY.emit(container);
    });

    self.waiting = true;
  }
}

@Component({
  tag: "iea-scroll-position"
})
export class MyComponent {
  // This component:
  @Element()
  host: HTMLDivElement;

  // TODO: Make this wotk for other elements:
  @Prop() watch: string = "html";

  @Event() scrollY: EventEmitter;

  // To track all of the elements matched by our this.watch selector:
  data: object[] = [];

  // To know when we're waiting for Animation Frame:
  waiting: boolean = false;

  // Will retain a reference to our scroll handler so we can unbind it:
  onScroll: any;

  componentWillLoad() {
    const self = this;
    const containers = document.querySelectorAll(self.watch);
    let i = containers.length;

    // Init scroll data for each matched element:
    while (i--) {
      const container = containers[i];
      if (!container.id) createUid("", container);
      self.data[container.id] = getScrollDataFor(container);
    }

    // Keep a reference to our custom scroll handler:
    const handler = (self.onScroll = onScroll.bind(this));

    addEventListener("scroll", handler);
    // addEventListener("resize", handler);
  }
  componentDidUnload() {
    const handler = this.onScroll;
    removeEventListener("scroll", handler);
    // removeEventListener("resize", handler);
  }

  // This component has no render method:
  // render() {}
}
