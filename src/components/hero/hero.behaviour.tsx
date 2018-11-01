// import { Prop } from "@stencil/core";
// import md from "nano-markdown";

// // Helper to escape html found in text:
// function safe(html) {
//   return String(html || "")
//     .replace(/'/g, "&apos;")
//     .replace(/"/g, "&quot;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;");
// }

// //Component(myClass.constructor)

// // @Component({
// //   tag: "iea-hero",
// //   styleUrl: "hero.scss"
// // })
// class MyComponent {
//   // Indicate that name should be a public property on the component
//   @Prop()
//   heading: string = "Hero heading";
//   @Prop()
//   bodycopy: string = "Hero bodycopy";
//   @Prop()
//   src: string =
//     "https://images.unsplash.com/photo-1526906346362-d9725bfeeb3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c8fdd96f3871f06fdd6e4510430aba61&auto=format&fit=crop&w=2250&q=80";
//   @Prop()
//   alt: string = "";

//   // https://www.dove.com/content/dam/unilever/dove/united_kingdom/general_image/personal_care_unidentified/personal_care_unidentified/day01_shot01_079_hero-279551.jpg.ulenscale.767x360.jpg

//   render() {
//     return [
//       <div class="img-box">
//         <img class="img" src={this.src} alt="" />
//       </div>,
//       <h1 class="heading">{safe(this.heading)}</h1>,
//       <p class="bodycopy" innerHTML={md(safe(this.bodycopy))} />
//     ];
//   }
// }

// export default MyComponent;
