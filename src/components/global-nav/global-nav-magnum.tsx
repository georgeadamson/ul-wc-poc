import { Component, Prop, Element, Watch } from '@stencil/core';
import togglePageNoScroll from '../../common/utils/dom/toggleScrollInhibitor';

const styles = {
  logo: 'logo',
  search: 'search',
  show: 'toggle-show',
  hide: 'toggle-hide',
  toggle: 'toggle'
};

// Prepare curried functions to filter child elements:
function filterBySlot(slot, item) {
  return slot ? item.slot === slot : !item.slot;
}
const byMenuItems = filterBySlot.bind(0, '');
const byToggleButton = filterBySlot.bind(0, 'toggle');
const bySearchBox = filterBySlot.bind(0, 'search');
const byLogoLink = filterBySlot.bind(0, 'logo');

@Component({
  tag: 'iea-global-nav-magnum',
  styleUrl: 'magnum/global-nav.magnum.scss',
  shadow: true
})
export class MyComponent {
  // Optional: Set this flag to initalise with menu toggle expanded:
  @Prop({ mutable: true })
  expanded: boolean = false;

  // Private: This component:
  @Element()
  host: HTMLDivElement;

  // Private: Will store array of children passed into component. Typically <a> elements:
  children: Element[];

  uid: string = Math.random()
    .toString(36)
    .substr(2);

  @Watch('expanded')
  onToggle(expanded: boolean) {
    togglePageNoScroll(expanded, this.uid);
  }

  componentWillLoad() {
    const self = this;
    const host = self.host;

    // Inspired by https://stackoverflow.com/questions/52421298/web-components-how-to-work-with-children
    self.children = Array.from(host.children);
    host.innerHTML = '';

    if (!host.id) {
      host.id = self.uid;
    }

    if (self.expanded) {
      togglePageNoScroll(true, self.uid);
    }
  }

  componentDidUnload() {
    togglePageNoScroll(false, this.uid);
  }

  // Handle delegated clicks on links & buttons:
  onClick = e => {
    const clicked = e.target.closest('.nav__item,[slot]');

    // Respond to click on menu toggle:
    if (clicked && clicked.slot === 'toggle') {
      this.expanded = !this.expanded;
    }
  };

  onKeyDown = e => {
    // Hit Escape key to close nav menu:

    if (e.key === 'Escape') {
      this.expanded = false;
    }
  };

  render() {
    const children = this.children;
    const menuToggle = children.find(byToggleButton);
    const searchBox = children.find(bySearchBox);
    const logoLink = children.find(byLogoLink);

    // Toggle aria-pressed attribute on the menu toggle button:
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role
    if (menuToggle && menuToggle.matches('button,[role=button],input[type=button]')) {
      menuToggle.setAttribute('aria-pressed', String(this.expanded));
    }

    return (
      <nav
        class="nav"
        onKeyDown={this.onKeyDown}
        onClick={this.onClick}
        aria-expanded={this.expanded}
      >
        {menuToggle && <div class={styles.toggle} innerHTML={menuToggle.outerHTML} />}

        {logoLink && <div class={styles.logo} innerHTML={logoLink.outerHTML} />}

        <ul class="items">
          {this.children.filter(byMenuItems).map(child => {
            const className = 'nav__item' + (styles[child.slot] ? ' ' + styles[child.slot] : '');

            return <li class={className} innerHTML={child.outerHTML} />;
          })}
        </ul>

        {searchBox && <div class={styles.search} innerHTML={searchBox.outerHTML} />}
      </nav>
    );
  }
}
