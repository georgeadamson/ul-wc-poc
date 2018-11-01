import { Component, Prop, Element } from "@stencil/core";

@Component({
  tag: "iea-global-nav",
  styleUrl: "global-nav.scss",
  shadow: true
})
export class MyComponent {
  // Assume we want logo className on first child. Specify -1 when none are logo.
  @Prop()
  logoIndex: number = 0;

  // This component:
  @Element()
  host: HTMLDivElement;

  // Private: Will store list of children passed into component. Typically links:
  children: Element[];

  componentWillLoad() {
    // Inspired by https://stackoverflow.com/questions/52421298/web-components-how-to-work-with-children
    this.children = Array.from(this.host.children);
    this.host.innerHTML = "";
  }

  render() {
    return (
      <nav>
        <ul class="nav-links">
          {this.children.map((child, i) => (
            <li
              innerHTML={child.outerHTML}
              class={i === this.logoIndex ? "logo" : undefined}
            />
          ))}
        </ul>
      </nav>
    );
  }
}
