import { Component, Prop, Element, Event, EventEmitter, State, Watch } from '@stencil/core';

// Helper to generate custom css style rule
// to control height of aspect-ratio element relative to width:
// If we didn't need to support IE11 then setting a CSS --variable might be better.
function aspectHeightStyle(aspectRatio) {
  return {
    paddingTop: 100 * aspectRatio + '%'
  };
}

@Component({
  tag: 'aup-img',
  styleUrls: ['../../common/sass/styles/spinner.scss', 'img.scss']
  //shadow: true
})
export class MyComponent {
  @Prop() src: string;
  @Prop() srcset: string;
  @Prop() sizes: string;
  @Prop() alt: string;
  @Prop() class: string;

  // Optional: Only used when both are specified, to calculate aspect ratio.
  // Setting these correctly will prevent reflow when image finally loads:
  @Prop() width: string;
  @Prop() height: string;

  // Private: Flag to track when img has loaded:
  @State() loaded: boolean;

  // Private: Will store array of placeholder children passed into component:
  children: Element[];

  // This component:
  @Element() host: HTMLDivElement;

  @Event() load: EventEmitter;

  // Reset loaded flag when src is changed:
  @Watch('src')
  srcChange(newValue, oldValue) {
    this.loaded = newValue !== oldValue;
  }

  componentWillLoad() {
    // Inspired by https://stackoverflow.com/questions/52421298/web-components-how-to-work-with-children
    this.children = Array.from(this.host.children);
  }

  onLoad = () => {
    // Raise custom load event:
    this.loaded = true;
    this.load.emit(this.src);
  };

  render() {
    const { src, srcset, sizes, width, height, loaded, onLoad, children } = this;
    let { alt, class: className } = this;
    let placeholder;

    alt = alt ? alt.trim() : '';
    className = 'img ' + (className || '');

    if (!loaded) {
      const customPlaceholder =
        children && children.length ? (
          <div class="children">
            <slot name="placeholder" />
          </div>
        ) : null;

      // Make absolutely sure we have usable numbers: (Prevent divide by zero error etc)
      const aspectRatio =
        width &&
        height &&
        parseInt('' + width) &&
        parseInt('' + height) &&
        parseInt('' + height) / parseInt('' + width);

      // When we know the aspect ratio we add a placeholder with same dimensions:
      placeholder = aspectRatio ? (
        <div class="aspect">
          <div class="spacer" style={aspectHeightStyle(aspectRatio)} />
          {customPlaceholder}
        </div>
      ) : (
        customPlaceholder
      );
    }

    // Tip: The alt.trim() fixes cases where an author has accidentally provided only whitespace.
    // Tip: We toggle the hidden attribute so that brands can customise a css transition.
    return [
      placeholder,

      <img
        src={src}
        srcset={srcset}
        sizes={sizes}
        alt={alt}
        class={className}
        onLoad={onLoad}
        hidden={!loaded}
      />
    ];
  }
}
