// EXPERIMENTAL

// import { Component, Prop } from "@stencil/core";

// @Component({
//   tag: "iea-logo",
//   shadow: true
// })
// export class IeaLogo {
//   @Prop()
//   href: string = "/";

//   // This is used as img alt text:
//   // (Matches logo[alt] selector in css warnings)
//   @Prop()
//   alt: string = "";

//   @Prop()
//   src: string = "";

//   render() {
//     return (
//       <a class="logo-link" href={this.href}>
//         {this.src ? (
//           <img class="logo-img" src={this.src} alt={this.alt} />
//         ) : (
//           <span class="alt">{this.alt}</span>
//         )}
//       </a>
//     );
//   }
// }
