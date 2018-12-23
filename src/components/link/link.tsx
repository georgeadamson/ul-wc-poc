import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';

const IMG_SELECTOR = 'img,picture,aup-img';

// Return true if element quacks like an image:
function isImgElement(elem: HTMLElement) {
  return elem.matches && elem.matches(IMG_SELECTOR);
}

function emitTrackingEvent(e?: MouseEvent) {
  const elem: MyComponent = this;
  const host = elem.host;

  // Prepare details to pass to the tracking handler:
  const detail = {
    type: e.type,
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
  styleUrl: 'link.scss'
  //scoped: true
})
export class MyComponent {
  /**
   * Required: href attribute for the link. Avoid href="#".
   */
  @Prop() href: string;

  /**
   * Optional id attribute for the link. Also used to associate aria-describedby when target="_blank".
   */
  @Prop() id: string;

  /**
   * Optional target attribute for the link. Set target="_blank" to open in new window.
   */
  @Prop() target: string;

  /**
   * Optional rel attribute for the link. Automatically default to rel="noopener" when target="_blank" to patch browser vulnerability.
   */
  @Prop() rel: string;

  /**
   * Optional tooltip text. When target="_blank" this defaults to 'Opens in new window' and is used for aria-describedby.
   * TODO: Smarter i18n for default texts.
   */
  @Prop() tooltip: string = this.target === '_blank' && 'Opens in new window';

  /**
   * Default true because we typically want to emit link click events for analytics tracking.
   */
  @Prop() events: boolean = true;

  /**
   * This components emits tracking events on click, to be handled by the tracking component.
   */
  @Event() tracking: EventEmitter;

  // Private: Internal reference to this component:
  @Element() host: HTMLDivElement;

  render() {
    const { host, href, target, id, tooltip, events } = this;
    let { rel } = this;
    let ariaDescribedById: string;
    let ariaDescribedByElem: object;

    // Attempt to detect when link is image instead of text:
    const isImageLink = !host.innerText && Array.from(host.children).some(isImgElement);

    // When link opens in new window we must make it clear to all users:
    // More info: https://medium.com/@svinkle/why-let-someone-know-when-a-link-opens-a-new-window-8699d20ed3b1
    // 1. HTML must include warning for screenreader users
    // 2. CSS should display an icon for every a[target="_blank"]
    // 3. They should display a tooltip via [data-tootip]:focus and [data-tootip]:hover selectors
    // 4. Expose a class on the anchor element to allow brand to style image links differently.
    if (target === '_blank') {
      // Browser vulnerability patch rel="noopener":
      // More info: https://developers.google.com/web/tools/lighthouse/audits/noopener
      if (!rel || !~rel.indexOf('noopener')) {
        rel = (rel || '') + ' noopener';
      }

      ariaDescribedById =
        'describedby-' +
        (id ||
          Math.random()
            .toString(36)
            .substr(2));

      // We've used <i> tag here to save bytes. It's safe to change to <div> if a daft markup test tool complains about the <i> tag.
      ariaDescribedByElem = (
        <i hidden id={ariaDescribedById}>
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
        aria-describedby={ariaDescribedById}
        class={isImageLink ? 'is-img-link' : undefined}
        data-tooltip={tooltip || undefined}
        // This event exists purely to allow another component to do analytics tracking:
        onClick={events ? emitTrackingEvent.bind(this) : undefined}
      >
        <slot />
        {ariaDescribedByElem}
      </a>
    );
  }
}
