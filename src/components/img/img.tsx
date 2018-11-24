import {
  Component,
  Prop,
  Element,
  Event,
  EventEmitter,
  State
  //Watch
} from "@stencil/core";

//import createUid from "../../common/utils/dom/createUid";

// const styleForAspectWrapper = {
//   display: "block",
//   position: "relative",
//   width: "100%"
// };

// const styleForAspectChildren = {
//   display: "block",
//   position: "absolute",
//   top: "0",
//   right: "0",
//   bottom: "0",
//   left: "0"
// };

// Helper to generate styles to control height of aspect-ratio element:
function styleForAspectSpacer(aspectRatio) {
  return {
    display: "block",
    paddingBottom: 100 * aspectRatio + "%"
  };
}

@Component({
  tag: "aup-img",
  styleUrl: "img.scss",
  shadow: true
})
export class MyComponent {
  @Prop() src: string;
  @Prop() srcset: string;
  @Prop() sizes: string;
  @Prop() alt: string;
  @Prop() class: string;

  // Optional: Used to calculate aspect ratio to prevent reflow:
  @Prop() width: string;
  @Prop() height: string;

  // Private: Flag to track when img has loaded:
  @State() loaded: boolean;

  // Private: Will store array of children passed into component. Typically a placeholder while loading:
  children: Element[];

  // This component:
  @Element() host: HTMLDivElement;

  @Event() load: EventEmitter;

  // Reset loaded flag when src is changed:
  // @Watch("src")
  // srcChange(newValue, oldValue) {
  //   this.loaded = newValue !== oldValue;
  // }

  componentWillLoad() {
    const host = this.host;

    // Inspired by https://stackoverflow.com/questions/52421298/web-components-how-to-work-with-children
    this.children = Array.from(host.children);
    host.innerHTML = "";
  }

  onLoad = () => {
    // Raise custom load event:
    this.loaded = true;
    this.load.emit();
  };

  render() {
    const {
      src,
      srcset,
      sizes,
      alt,
      class: className,
      width,
      height,
      loaded,
      onLoad,
      children
    } = this;

    let placeholder;

    if (!loaded) {
      const aspectRatio =
        height && width && parseInt("" + height) / parseInt("" + width);
      const hasChildren = !!(children && children.length);

      // Placeholder while waiting for img to load:
      placeholder = aspectRatio ? (
        // Placeholder to maintain aspect ratio & contain children:
        <div class="img__placeholder img__placeholder--aspect">
          <div style={styleForAspectSpacer(aspectRatio)} hidden />
          {hasChildren && (
            <div class="img__placeholder--children">{children}</div>
          )}
        </div>
      ) : (
        // Placeholder just to contain children:
        // TODO: Fix undefined children
        hasChildren && <div class="img__placeholder">{children}</div>
      );
    }

    return [
      placeholder,

      <img
        src={src}
        srcset={srcset}
        sizes={sizes}
        alt={alt || ""}
        class={className}
        hidden={!loaded}
        onLoad={onLoad}
      />
    ];
  }
}
