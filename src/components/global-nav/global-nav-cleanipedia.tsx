import { Component, Prop, Element, Watch } from '@stencil/core';

// Helper to disable scrolling on body by toggling "overflow-y:hidden" style:
import toggleScrollInhibitor from '../../common/utils/dom/toggleScrollInhibitor';

// Helper to filter elements by their <slot="name">
function filterBySlot(slot, item) {
  return slot ? item.slot === slot : !item.slot;
}

// Prepare curried functions to filter child elements:
const byToggleSlot = filterBySlot.bind(0, 'toggle');
//const bySearchSlot = filterBySlot.bind(0, 'search');
//const byLogoSlot = filterBySlot.bind(0, 'logo');
const bySubheadingSlot = filterBySlot.bind(0, 'subheading');
const byMenuItems = filterBySlot.bind(0, '');

function groupMenuItems(children) {
  return children.reduce(function(result, item) {
    const submenu = item.getAttribute('data-submenu') || '1';
    (result[submenu] || (result[submenu] = [])).push(item);
    return result;
  }, {});
}

function renderMenuItems() {
  const { expanded, children } = this;
  const subHeadings = children.filter(bySubheadingSlot);
  const menuItems = children.filter(byMenuItems);
  const subMenus = groupMenuItems(menuItems);

  return (
    <div class="menu" hidden={!expanded}>
      {Object.keys(subMenus).map((key, i) => {
        // Create a unique id if we have a subheading to render:
        // TODO: Smarter id that will work with server-side render (SSR)
        const id = subHeadings[i]
          ? 'subheading-' +
            Math.random()
              .toString(36)
              .substr(-4)
          : undefined;

        return (
          <div class="submenu">
            {id && <em class="subheading" id={id} innerHTML={subHeadings[i].outerHTML} />}

            <ul class="items" aria-labelledby={id}>
              {subMenus[key].map(menu => (
                <li class={'item ' + (menu.slot || '')} innerHTML={menu.outerHTML} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

@Component({
  tag: 'iea-global-nav-cleanipedia',
  styleUrl: 'cleanipedia/global-nav.cleanipedia.scss',
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

  // Private: Unique id for this element:
  uid: string =
    'uid-' +
    Math.random()
      .toString(36)
      .substr(-4);

  @Watch('expanded')
  onToggle(expanded: boolean) {
    toggleScrollInhibitor(expanded, this.host.id);
  }

  componentWillLoad() {
    const self = this;
    const host = self.host;

    // Inspired by https://stackoverflow.com/questions/52421298/web-components-how-to-work-with-children
    self.children = Array.from(host.children);
    // host.innerHTML = '';

    if (!host.id) {
      host.id = self.uid;
    }

    if (self.expanded) {
      toggleScrollInhibitor(true, host.id);
    }
  }

  componentDidUnload() {
    toggleScrollInhibitor(false, this.host.id);
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
    const menuToggle = children.find(byToggleSlot);

    //console.log(menuToggle.querySelectorAll("[data-when-pressed='hide']"));

    // Toggle aria-pressed attribute on the menu toggle button:
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role
    if (menuToggle && menuToggle.matches('button,[role=button],input[type=button]')) {
      const pressed = String(this.expanded);

      menuToggle.setAttribute('aria-pressed', pressed);

      // Too much? Can we do without this?
      Array.from(menuToggle.querySelectorAll('[data-hide-when-pressed]')).forEach(
        (node: HTMLElement) => {
          node['toggleAttribute'](
            'hidden',
            node.getAttribute('data-hide-when-pressed') === pressed
          );
        }
      );
    }

    return (
      <nav
        class="nav"
        onKeyDown={this.onKeyDown}
        onClick={this.onClick}
        aria-expanded={this.expanded}
      >
        <slot name="logo" />

        <slot name="toggle" />

        <slot name="menu">
          {/* Default menu items:
              Most sites need one list of menu items but we allow for more. */}
          {renderMenuItems.call(this)}
        </slot>

        <slot name="search" />
      </nav>
    );
  }
}
