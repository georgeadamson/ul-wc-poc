// @ts-ignore
import { Component, Prop } from "@stencil/core";
import md from "../../common/utils/dom/markdown.js";
import safe from "../../common/utils/dom/html-safe.js";

@Component({
  tag: "iea-hero-magnum",
  styleUrl: "magnum/hero.magnum.scss",
  shadow: true
})
export class HeroComponent {
  @Prop()
  heading: string = "Hero heading";

  @Prop()
  headingLevel: number = 1;

  @Prop()
  subheading: string; // Will be ingored when heading is blank

  @Prop()
  bodycopy: string = "Hero bodycopy";

  @Prop()
  src: string =
    "https://images.unsplash.com/photo-1526906346362-d9725bfeeb3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c8fdd96f3871f06fdd6e4510430aba61&auto=format&fit=crop&w=2250&q=80";

  @Prop()
  alt: string = ""; // Leave blank if image is only decorative

  @Prop()
  target: string;

  @Prop()
  theme: string = "A";

  // https://www.dove.com/content/dam/unilever/dove/united_kingdom/general_image/personal_care_unidentified/personal_care_unidentified/day01_shot01_079_hero-279551.jpg.ulenscale.767x360.jpg

  render() {
    const { src, alt, heading, subheading, bodycopy, theme } = this;
    const themeClass = "theme" + theme;
    const Hx = heading && "h" + this.headingLevel; // h1, h2 etc

    // Prepare img markup if enough props supplied:
    // Note we make absolutely sure alt attribute is not omitted.
    const img = src && (
      <div class="img-box">
        <aup-img
          class="img"
          src={src}
          alt={alt || ""}
          width="2048"
          height="868"
        />
      </div>
    );

    // Prepare one or both headings if enough props supplied:
    const headings = [
      heading && <Hx class="heading">{heading}</Hx>,
      subheading && <p class="subheading">{subheading}</p>
    ];

    // Wrap both headings in <header> tag:
    // Here's why: https://www.w3.org/TR/2014/REC-html5-20141028/common-idioms.html
    const header = heading && subheading && (
      <header class="headings">{headings}</header>
    );

    return (
      <div class={themeClass}>
        {[
          img,
          header,
          !header && heading && headings[0],
          bodycopy && (
            <p class="bodycopy" innerHTML={md(safe(bodycopy), this)} />
          )
        ]}
      </div>
    );
  }
}
