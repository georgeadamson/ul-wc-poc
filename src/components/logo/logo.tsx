import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'iea-logo',
  styleUrl: './magnum/logo-magnum.scss',
  shadow: false
})
export class MyComponent {
  @Prop()
  href: string = '/';

  // This is used as img alt text:
  // (Matches img[alt] selector in css warnings)
  @Prop()
  alt: string = 'Homepage';

  @Prop()
  src: string = '';

  render() {
    return (
      <a class="logo__link" href={this.href}>
        {this.src ? (
          <img class="logo__img" src={this.src} alt={this.alt} />
        ) : (
          <span class="logo__alt">{this.alt}</span>
        )}
      </a>
    );
  }
}
