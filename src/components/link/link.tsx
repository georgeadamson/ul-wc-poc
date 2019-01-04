import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';
import fixRerender from '../../common/utils/dom/fixRerender';

const IMG_SELECTOR = 'img,picture,aup-img,video';

// Experimental:
// interface Aria {
//   [key: string]: string;
// }

// Used to prevent recursive nesting when component is re-rendered.
// See fixRerender for more info.
function isUnwanted(elem: any) {
  return (
    // Is it a link?
    elem.nodeName === 'A' ||
    // Is it a custom node we added on a previous render:
    (elem['id'] && elem['id'] === elem.parentNode.getAttribute('aria-describedby'))
  );
}

// Return true if element quacks like an image:
function isImgElement(elem: HTMLElement) {
  return elem.matches && elem.matches(IMG_SELECTOR);
}

function emitTrackingEvent(e?: MouseEvent) {
  const elem: MyComponent = this;
  const host = elem.host;

  // Prepare details to pass to the tracking handler:
  const detail = {
    type: e && e.type,
    tagName: 'a',
    id: elem.id,
    href: elem.href,
    target: elem.target,

    // Attempt to derive link text or the img.alt:
    text: host && (host.innerText || ((host.querySelector(IMG_SELECTOR) || {}) as any).alt),

    // Experimental: Attempt to detect when click was triggered by keyboard:
    keyboard: !e.screenX && !e.screenY
  };

  elem.tracking.emit(detail);
}

@Component({
  tag: 'aup-link',
  styleUrls: [
    '../../common/sass/styles/tooltip.scss',
    '../../common/sass/styles/new-window.scss',
    'link.scss'
  ]
})
export class MyComponent {
  /**
   * Required: href attribute for the link. Avoid href="#".
   */
  @Prop() href: string;

  /**
   * Optional id attribute for the link. We assume all links need an id. Also used to associate aria-describedby when target="_blank".
   */
  @Prop() id: string =
    'uid-' +
    Math.random()
      .toString(36)
      .substr(-4);

  /**
   * Optional target attribute for the link. Set target="_blank" to open in new window.
   */
  @Prop() target: string;

  /**
   * Optional rel attribute for the link. Automatically default to rel="noopener" when target="_blank" to patch browser vulnerability.
   */
  @Prop({ mutable: true }) rel: string;

  /**
   * Optional tooltip text. When target="_blank" this defaults to 'Opens in new window' and is used for aria-describedby.
   * TODO: Smarter i18n for default text.
   */
  @Prop({ mutable: true }) tooltip: string;

  /**
   * Default true because we typically want to emit link click events for analytics tracking.
   */
  @Prop() withEvents: boolean = true;

  /**
   * Optional aria attributes map.
   */
  @Prop({ mutable: true }) aria: any; // object

  /**
   * This components emits tracking withEvents on click, to be handled by the tracking component.
   */
  @Event() tracking: EventEmitter;

  // Private: Internal reference to this component:
  @Element() host: HTMLElement;

  componentWillLoad() {
    const self = this;

    if (self.target === '_blank') {
      // Must have "Opens in new window" help text:
      // TODO: Smarter i18n for default text.
      if (!self.tooltip) {
        self.tooltip = 'Opens in new window';
      }

      // Our accessible help text element must have a unique id:
      if (!self.aria) {
        self.aria = {};
      }
      if (!self.aria.describedby) {
        self.aria.describedby = 'describes-' + self.id;
      }

      // Browser vulnerability patch rel="noopener":
      // More info: https://developers.google.com/web/tools/lighthouse/audits/noopener
      if (!self.rel || !~self.rel.indexOf('noopener')) {
        self.rel = (self.rel || '') + ' noopener';
      }
    }

    // Smelly hack to un-nest a Component's child elements
    // if the component is being rendered again.
    // Without this, if the first render modified children,
    // then the next render may modify the modified children 😱
    // In the case of link component, we'd end up with nested links :(
    fixRerender(self.host, isUnwanted);
  }

  render() {
    const { host, href, target, id, tooltip, withEvents, aria } = this;
    let { rel } = this;
    let ariaDescribedByElem: object;

    // This handler exists purely to allow another component to receive analytics tracking:
    const trackEvent = withEvents ? emitTrackingEvent.bind(this) : undefined;

    // Attempt to detect when link is image instead of text:
    const isImageLink = !host.innerText && Array.from(host.children).some(isImgElement);

    // When link opens in new window we must make it clear to all users:
    // More info: https://medium.com/@svinkle/why-let-someone-know-when-a-link-opens-a-new-window-8699d20ed3b1
    // 1. HTML must include warning for screenreader users
    // 2. CSS should display an icon for every a[target="_blank"]
    // 3. They should display a tooltip via [data-tootip]:focus and [data-tootip]:hover selectors
    // 4. Expose a class on the anchor element to allow brand to style image links differently.
    if (target === '_blank') {
      // We've used <i> tag here to save bytes. It's safe to change to <div> if a daft markup validation tool complains about the <i> tag.
      ariaDescribedByElem = (
        <i hidden id={aria.describedby}>
          {tooltip}
        </i>
      );
    }

    return (
      <a
        id={id}
        rel={rel}
        href={href}
        target={target || undefined}
        aria-describedby={aria && aria.describedby}
        class={isImageLink ? 'is-img-link' : undefined}
        data-tooltip={tooltip || undefined}
        onClick={trackEvent}
        onMouseEnter={trackEvent}
      >
        <slot />
        {ariaDescribedByElem}
      </a>
    );
  }
}
