import { Component, Prop } from '@stencil/core';
//import LogoComponent from "./logo.behaviour";

@Component({
  tag: 'iea-logo-magnum',
  styleUrl: 'logo-magnum.scss',
  shadow: true
})
export class MyComponent {
  @Prop()
  href: string = '/';

  // This is used as img alt text:
  // (Matches logo[alt] selector in css warnings)
  @Prop()
  alt: string = '';

  @Prop()
  src: string = '';

  render() {
    return (
      <a class="logo-link" href={this.href}>
        {this.src ? (
          <img class="logo-img" src={this.src} alt={this.alt} />
        ) : (
          <span class="alt">{this.alt}</span>
        )}
      </a>
    );
  }
}
