import { Component, Prop } from "@stencil/core";

@Component({
  tag: "iea-skip-to-content",
  styleUrl: "skip-to-content.scss",
  shadow: true
})
export class MyComponent {
  @Prop({ reflectToAttr: true })
  contentId: string;

  @Prop()
  text: string = "Skip to main content";

  render() {
    let contentId = this.contentId;

    // For use in legacy pages that may not have set id on main content:
    if (!contentId) {
      let contentElem =
        // Attempt to find the main content ourselves:
        document.querySelector('#main-content,main,[role="main"]') ||
        // @ts-ignore
        (document.querySelector("header") || {}).nextElementSibling;

      // Give the element an id if it hasn't got one already:
      if (contentElem && !contentElem.id) {
        contentElem.id = "main-content";
      }

      contentId = contentElem && contentElem.id;
    }

    const href = contentId ? "#" + contentId : undefined;

    return <a href={href}>{this.text}</a>;
  }
}
