// @ts-ignore
import { Component, Prop } from "@stencil/core";
//import HeroComponentBase from "./hero.behaviour";
import markdown from "nano-markdown";

// Strip <p>...</p> added by markdown helper:
// TODO: Find a more efficient solution:
function md(text) {
  return markdown(text).replace(/^<p>|<\/p>$/g, "");
}

// Helper to escape html found in text:
function safe(html) {
  return String(html || "")
    .replace(/'/g, "&apos;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

@Component({
  tag: "iea-hero",
  styleUrl: "hero.dove.scss",
  shadow: true
})
export class HeroComponent {
  // Indicate that name should be a public property on the component
  @Prop()
  heading: string = "Hero heading";
  @Prop()
  bodycopy: string = "Hero bodycopy";
  @Prop()
  src: string =
    "https://images.unsplash.com/photo-1526906346362-d9725bfeeb3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c8fdd96f3871f06fdd6e4510430aba61&auto=format&fit=crop&w=2250&q=80";
  @Prop()
  alt: string = "";
  @Prop()
  headingLevel: number = 1;

  // https://www.dove.com/content/dam/unilever/dove/united_kingdom/general_image/personal_care_unidentified/personal_care_unidentified/day01_shot01_079_hero-279551.jpg.ulenscale.767x360.jpg

  render() {
    const Hx = "h" + this.headingLevel; // h1, h2 etc

    return [
      <div class="img-box">
        <img class="img" src={this.src} alt={this.alt} />
      </div>,
      <Hx class="heading">{md(safe(this.heading))}</Hx>,
      <p class="bodycopy" innerHTML={md(safe(this.bodycopy))} />
    ];
  }
}
