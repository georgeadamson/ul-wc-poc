import { Component, Prop } from "@stencil/core";

@Component({
  tag: "iea-logo",
  styleUrl: "logo.scss"
})
export class MyComponent {
  @Prop()
  href: string = "/";

  @Prop()
  alt: string = "";

  @Prop()
  src: string =
    "https://www.dove.com/content/dam/unilever/dove/global/Dove.png";

  render() {
    return (
      <a class="logo-link" href={this.href}>
        <img class="logo-img" src={this.src} alt={this.alt} />
      </a>
    );
  }
}
