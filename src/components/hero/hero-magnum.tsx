/**
 * hero component
 * Features:
 * - alt tag is never omitted.
 * - Can fill space before it loads, to reduce reflow.
 */

// @ts-ignore
import { Component, Prop } from '@stencil/core';
import md from '../../common/utils/dom/markdown.js';
import safe from '../../common/utils/dom/html-safe.js';

@Component({
  tag: 'iea-hero-magnum',
  styleUrl: 'magnum/hero.magnum.scss',
  shadow: true
})
export class HeroComponent {
  @Prop()
  heading: string = 'Hero heading';

  @Prop()
  headingLevel: number = 1;

  // subheading is ingored when heading is blank
  @Prop()
  subheading: string;

  @Prop()
  bodycopy: string = 'Hero bodycopy';

  @Prop()
  src: string =
    'https://images.unsplash.com/photo-1526906346362-d9725bfeeb3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c8fdd96f3871f06fdd6e4510430aba61&auto=format&fit=crop&w=2250&q=80';

  // Leave alt blank if image is purely decorative and not content
  @Prop()
  alt: string = '';

  // Optional: Only used when both are specified, to calculate aspect ratio.
  // Setting these correctly will prevent reflow when image finally loads:
  @Prop() width: string;
  @Prop() height: string;

  @Prop()
  target: string;

  @Prop()
  theme: string = 'A';

  render() {
    const { src, alt, width, height, heading, subheading, bodycopy, theme } = this;
    const themeClass = 'theme' + theme;
    const Hx = heading && 'h' + this.headingLevel; // h1, h2 etc

    // Prepare img markup if enough props supplied:
    const img = src && (
      <div class="img-box">
        <aup-img class="img" src={src} alt={alt} width={width} height={height}>
          <div slot="placeholder">Placeholder...</div>
        </aup-img>
      </div>
    );

    // Prepare one or both headings if enough props supplied:
    const headings = heading && [
      heading && <Hx class="heading">{heading}</Hx>,
      subheading && <p class="subheading">{subheading}</p>
    ];

    // Wrap both headings in <header> tag:
    // Here's why: https://www.w3.org/TR/2014/REC-html5-20141028/common-idioms.html
    const header = heading && subheading && <header class="headings">{headings}</header>;

    return (
      <div class={themeClass}>
        {[
          img,
          header,
          !header && headings && headings[0],
          bodycopy && <p class="bodycopy" innerHTML={md(safe(bodycopy), this)} />
        ]}
      </div>
    );
  }
}
