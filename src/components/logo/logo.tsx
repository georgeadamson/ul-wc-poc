import { Component, Prop } from "@stencil/core";

@Component({
  tag: "iea-logo",
  styleUrl: "logo.scss"
})
export class MyComponent {
  @Prop()
  href: string = "/";

  // This is used as img alt text:
  // (Matches logo[text] selector in css warnings)
  @Prop()
  text: string = "";

  // https://www.dove.com/content/dam/unilever/dove/global/Dove.png

  @Prop()
  src: string =
    "https://www.magnumicecream.com/content/dam/unilever/magnum/global/icon/ice_cream/all/magnum_logo-1129263.png";
  //"https://www.dove.com/content/dam/unilever/dove/global/Dove.png";

  render() {
    return (
      <a class="logo-link" href={this.href}>
        {this.src ? (
          <img class="logo-img" src={this.src} alt={this.text} />
        ) : (
          this.text
        )}
      </a>
    );
  }
}
