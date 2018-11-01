import { Component, Prop } from "@stencil/core";

@Component({
  tag: "iea-footer-nav",
  styleUrl: "footer-nav.scss"
})
export class MyComponent {
  // Indicate that name should be a public property on the component
  @Prop()
  name: string;

  render() {
    return <nav>Footer</nav>;
  }
}
