// @ts-ignore
import { Component, Prop, Element } from '@stencil/core';

@Component({
  tag: 'iea-carousel',
  styleUrl: 'carousel.scss',
  shadow: true
})
export class Carousel {
  // Private: This component:
  @Element()
  host: HTMLDivElement;

  // Private: Will store array of children passed into component. Typically <a> elements:
  children: Element[];

  componentWillLoad() {
    const self = this;
    const host = self.host;

    // Inspired by https://stackoverflow.com/questions/52421298/web-components-how-to-work-with-children
    self.children = Array.from(host.children);
    host.innerHTML = '';
  }

  render() {
    const { children } = this;

    return (
      <ul>
        {children.map(child => (
          <li innerHTML={child.outerHTML} />
        ))}
      </ul>
    );
  }
}
