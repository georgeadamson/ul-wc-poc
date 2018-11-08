import { Component, Prop, State, Element } from "@stencil/core";

@Component({
  tag: "iea-lazy",
  styleUrl: "lazy.scss"
})
export class MyComponent {
  // This component:
  @Element()
  host: HTMLDivElement;

  @Prop()
  placeholder: string = "Loading...";

  @State()
  loaded: boolean = false;

  // Private: Will store list of children passed into component:
  children: Element[];

  componentWillLoad() {
    // Inspired by https://stackoverflow.com/questions/52421298/web-components-how-to-work-with-children
    this.children = Array.from(this.host.children);
    this.host.innerHTML = "";

    const lazyLoad = () => {
      if (!this.loaded) {
        setTimeout(
          function() {
            this.loaded = true;
          }.bind(this),
          2000
        );
      }
      //window.removeEventListener("load", lazyLoad);
    };

    //window.addEventListener("load", lazyLoad);
    lazyLoad();
  }

  render() {
    //console.log(this.children);
    return this.loaded ? this.children : <span innerHTML={this.placeholder} />;
  }
}
