import { Component, Prop, Element, Watch } from '@stencil/core';

// Helper to disable scrolling on body by toggling "overflow-y:hidden" style:
import toggleScrollInhibitor from '../../common/utils/dom/toggleScrollInhibitor';

// Helper to filter elements by their <slot="name">
function filterBySlot(slot, item) {
  return slot ? item.slot === slot : !item.slot;
}

// Prepare curried functions to filter child elements:
const byToggleButton = filterBySlot.bind(0, 'toggle');
const bySearchBox = filterBySlot.bind(0, 'search');
const byLogoLink = filterBySlot.bind(0, 'logo');
const bySubheading = filterBySlot.bind(0, 'subheading');
const byMenuItem = filterBySlot.bind(0, '');

function groupMenuItems(children) {
  return children.reduce(function(result, item) {
    const submenu = item.getAttribute('data-submenu') || '1';
    (result[submenu] || (result[submenu] = [])).push(item);
    return result;
  }, {});
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

  uid: string = Math.random()
    .toString(36)
    .substr(2);

  @Watch('expanded')
  onToggle(expanded: boolean) {
    toggleScrollInhibitor(expanded, this.uid);
  }

  componentWillLoad() {
    const self = this;
    const host = self.host;

    // Inspired by https://stackoverflow.com/questions/52421298/web-components-how-to-work-with-children
    self.children = Array.from(host.children);
    //host.innerHTML = '';

    if (!host.id) {
      host.id = self.uid;
    }

    if (self.expanded) {
      toggleScrollInhibitor(true, self.uid);
    }
  }

  componentDidUnload() {
    toggleScrollInhibitor(false, this.uid);
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
    const subHeadings = children.filter(bySubheading);
    const menuItems = children.filter(byMenuItem);
    const subMenus = groupMenuItems(menuItems);
    console.log(subHeadings);
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
        {/* {menuToggle && (
          <div class={styles.toggle}>
            <slot name="toggle" />
          </div>
        )} */}

        <slot name="toggle" />

        {logoLink && <div class="logo" innerHTML={logoLink.outerHTML} />}

        {Object.keys(subMenus).map((key, i) => {
          // Create a unique id if we have a subheading to render:
          const id = subHeadings[i]
            ? 'subheading-' +
              Math.random()
                .toString(36)
                .substr(2)
            : undefined;

          return (
            <div class="menu">
              {id && <em class="subheading" id={id} innerHTML={subHeadings[i].outerHTML} />}

              <ul class="items" aria-labelledby={id}>
                {subMenus[key].map(child => {
                  const className = 'item ' + (child.slot || '');
                  return <li class={className} innerHTML={child.outerHTML} />;
                })}
              </ul>
            </div>
          );
        })}

        {searchBox && <div class="search" innerHTML={searchBox.outerHTML} />}
      </nav>
    );
  }
}
