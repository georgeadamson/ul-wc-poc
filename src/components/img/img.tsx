import {
  Component,
  Prop,
  Element,
  Event,
  EventEmitter,
  State,
  Watch
} from "@stencil/core";

// Helper to generate custom css style rule
// to control height of aspect-ratio element relative to width:
function styleForAspectSpacer(aspectRatio) {
  return {
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

  // Optional: Set both to calculate aspect ratio and prevent reflow:
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
  @Watch("src")
  srcChange(newValue, oldValue) {
    this.loaded = newValue !== oldValue;
  }

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
      // Make absolutely sure we have usable numbers: (And revent divide by zero error etc)
      const aspectRatio =
        width &&
        height &&
        parseInt("" + width) &&
        parseInt("" + height) &&
        parseInt("" + height) / parseInt("" + width);
      const hasChildren = !!(children && children.length);

      // When we know the aspect ratio we can make a placeholder with same dimensions:
      placeholder = aspectRatio ? (
        // Placeholder to maintain aspect ratio & contain children:
        <div class="aspect">
          <div
            class="aspect__spacer"
            style={styleForAspectSpacer(aspectRatio)}
          />
          {hasChildren && (
            <div class="children aspect__children">{children}</div>
          )}
        </div>
      ) : (
        // Placeholder just to contain children:
        // TODO: Fix undefined children
        hasChildren && <div class="children">{children}</div>
      );
    }

    // The alt.trim() fixes cases where an author has accidentally provided only whitespace:
    return [
      placeholder,

      <img
        src={src}
        srcset={srcset}
        sizes={sizes}
        alt={alt ? alt.trim() : ""}
        class={className}
        hidden={!loaded}
        onLoad={onLoad}
      />
    ];
  }
}
