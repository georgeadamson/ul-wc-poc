import { Component, Prop } from "@stencil/core";

// @Component({
//   tag: "my-component",
//   styleUrl: "my-component.css",
//   shadow: true
// })
// export class MyComponent {
//   @Prop()
//   first: string;
//   @Prop()
//   last: string;

//   render() {
//     return <div>foobar</div>;
//   }
// }

class MyComponent {
  @Prop()
  first: string;
  @Prop()
  last: string;

  render() {
    return <div>foobar</div>;
  }
}

export default Component({
  tag: "my-component",
  styleUrl: "my-component.css",
  shadow: true
}).bind(MyComponent);
