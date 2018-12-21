import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';

const IMG_SELECTOR = 'img,picture,aup-img';

// Return true if element quacks like an image:
function isImgElement(elem: HTMLElement) {
  return elem.matches && elem.matches(IMG_SELECTOR);
}

function emitTrackingEvent(e?: MouseEvent) {
  const elem: MyComponent = this;
  const host = elem.host;

  // Prepare details to pass to tracking handler:
  const detail = {
    type: e.type,
    tagName: 'a',
    id: elem.id,
    href: elem.href,
    target: elem.target,

    // Attempt to derive link text or the img.alt:
    // @ts-ignore
    text: host && (host.innerText || (host.querySelector(IMG_SELECTOR) || {}).alt),

    // Experimental: Attempt to detect when click was triggered by keyboard:
    keyboard: !e.screenX && !e.screenY
  };

  elem.tracking.emit(detail);
}

@Component({
  tag: 'aup-link',
  styleUrl: 'link.scss',
  shadow: true
})
export class MyComponent {
  @Prop() href: string;
  @Prop() id: string;
  @Prop() rel: string; // Enforces rel="noopener" when target="_blank"
  @Prop() target: string;

  // Only used when target="_blank"
  @Prop() targetMessage: string = 'Opens in new window';

  // Links are special. Assume we always want events enabled for analytics tracking:
  @Prop() events: boolean = true;

  @Event() tracking: EventEmitter;

  // This component:
  @Element() host: HTMLDivElement;

  // This event exists purely to allow some other component to do analytics tracking:
  onClick = () => {
    if (this.events) {
      emitTrackingEvent.call(this);
    }
  };

  render() {
    const { host, href, target, id, targetMessage, events, onClick } = this;
    let { rel } = this;

    let rel: string;
    let ariaDescribedById: string;
    let ariaDescriptionElem: object;
    let tooltip: string;

    // Attempt to detect when link is image instead of text:
    const isImageLink = !host.innerText && Array.from(host.children).some(isImgElement);

    // When link opens in new window we must make it clear to all users:
    // More info: https://medium.com/@svinkle/why-let-someone-know-when-a-link-opens-a-new-window-8699d20ed3b1
    // 1. HTML must include warning for screenreader users
    // 2. CSS should display an icon for every a[target="_blank"]
    // 3. They should display a tooltip via [data-tootip]:focus and [data-tootip]:hover selectors
    // 4. Expose a class on the anchor element to allow brand to style image links differently.
    if (target === '_blank') {
      // Vulnerability patch: rel="noopener": https://developers.google.com/web/tools/lighthouse/audits/noopener
      if (!rel || !~rel.indexOf('noopener')) rel = (rel || '') + ' noopener';

      ariaDescribedById =
        'describedby-' +
        (id ||
          Math.random()
            .toString(36)
            .substr(2));

      // We've used <i> tag here to save bytes. It's safe to change to <div> if a daft markup test tool objects to the <i> tag.
      ariaDescriptionElem = (
        <i hidden id={ariaDescribedById}>
          {targetMessage}
        </i>
      );

      tooltip = targetMessage;
    }

    return (
      <a
        id={id}
        href={href}
        target={target || undefined}
        aria-describedby={ariaDescribedById}
        data-tooltip={tooltip}
        onClick={events ? onClick : undefined}
        class={isImageLink ? 'is-img-link' : undefined}
        rel={rel}
      >
        <slot />
        {ariaDescriptionElem}
      </a>
    );
  }
}
