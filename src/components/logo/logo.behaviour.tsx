import { Prop } from "@stencil/core";

export default class MyComponent {
  @Prop()
  href: string = "/";

  // This is used as img alt text:
  // (Matches logo[alt] selector in css warnings)
  @Prop()
  alt: string = "";

  // https://www.dove.com/content/dam/unilever/dove/global/Dove.png

  @Prop()
  src: string = "";
  // "https://www.magnumicecream.com/content/dam/unilever/magnum/global/icon/ice_cream/all/magnum_logo-1129263.png";
  // "https://www.dove.com/content/dam/unilever/dove/global/Dove.png";

  render() {
    return (
      <a class="logo-link" href={this.href}>
        hello
        {this.src ? (
          <img class="logo-img" src={this.src} alt={this.alt} />
        ) : (
          <span class="alt">{this.alt}</span>
        )}
      </a>
    );
  }
}
