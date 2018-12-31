/**
 * hero component
 * Features:
 * - alt tag is never omitted.
 * - Can fill space before it loads, to reduce reflow.
 */

// @ts-ignore
import { Component, Prop } from '@stencil/core';
import md from '../../common/utils/dom/markdown.js';

@Component({
  tag: 'iea-hero',
  styleUrl: 'hero.cleanipedia.scss',
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

  @Prop() link: string | any;

  render() {
    const { src, alt, width, height, heading, subheading, bodycopy, theme, link } = this;
    const themeClass = 'theme' + theme;

    let linkAttrs: any = undefined;

    if (link instanceof Object && !Array.isArray(link)) {
      linkAttrs = link;
    } else {
      try {
        linkAttrs = JSON.parse(String(link));
      } catch (err) {
        console.error(
          'Hero component failed to parse `link` attribute: Invalid JSON string',
          link,
          err
        );
      }
    }

    const Hx = heading && 'h' + this.headingLevel; // h1, h2 etc

    // Prepare one or both headings if enough props supplied:
    const headings = heading && [
      heading && <Hx class="heading">{md(heading)}</Hx>,
      subheading && <p class="subheading">{md(subheading)}</p>
    ];

    // Wrap both headings in <header> tag:
    // Here's why: https://www.w3.org/TR/2014/REC-html5-20141028/common-idioms.html
    const header = heading && subheading && <header class="headings">{headings}</header>;

    // Prepare image tag if needed:
    const img = src && (
      <aup-img class="img x" src={src} alt={alt} width={width} height={height}>
        <div slot="placeholder">Placeholder...</div>
      </aup-img>
    );

    return (
      <div class={themeClass}>
        {/* Only render img if src supplied. Wrap in link if specified: */}
        {src && (
          <div class="img-box">
            {linkAttrs && linkAttrs.href ? <aup-link {...linkAttrs}>{img}</aup-link> : img}
          </div>
        )}

        <div class="copy">
          {header}
          {!header && headings && headings[0]}
          {bodycopy && <p class="bodycopy" innerHTML={md(bodycopy, this)} />}
        </div>
      </div>
    );
  }
}
