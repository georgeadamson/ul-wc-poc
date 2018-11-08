import { Component, Prop, Element } from "@stencil/core";

const styles = {
  logo: "nav__item--logo",
  search: "nav__item--search",
  show: "nav__item--toggle-show",
  hide: "nav__item--toggle-hide",
  toggle: "nav__item--toggle",

  hiding: "nav__menu--hiding",
  showing: "nav__menu--showing"
};

// Reusable array filter function to make
// curried functions to filter child elements:
function filterBySlot(slot, item) {
  return slot ? item.slot === slot : !item.slot;
}
const byMenuItems = filterBySlot.bind(0, "");
const byToggleButton = filterBySlot.bind(0, "toggle");
const bySearchBox = filterBySlot.bind(0, "search");
const byLogoLink = filterBySlot.bind(0, "logo");

@Component({
  tag: "iea-global-nav",
  styleUrl: "magnum/global-nav.magnum.scss",
  shadow: true
})
export class MyComponent {
  @Prop()
  logoIndex: number = 0;

  @Prop({ mutable: true })
  expanded: boolean = false;

  // This component:
  @Element()
  host: HTMLDivElement;

  // Private: Will store array of children passed into component. Typically <a> elements:
  children: Element[];

  componentWillLoad() {
    // Inspired by https://stackoverflow.com/questions/52421298/web-components-how-to-work-with-children
    this.children = Array.from(this.host.children);
    this.host.innerHTML = "";
  }

  // Handle delegated clicks on links & buttons:
  onClick = e => {
    const clicked = e.target.closest(".nav__item,[slot]");

    if (clicked) {
      // Respond to click on menu toggle:
      if (clicked.slot === "toggle") {
        this.expanded = !this.expanded;
      }
    }
  };

  onKeyDown = e => {
    // Hit Escape key to close nav menu:
    if (e.which === 27) {
      this.expanded = false;
    }
  };

  render() {
    const children = this.children;
    const menuToggle = children.find(byToggleButton);
    const searchBox = children.find(bySearchBox);
    const logoLink = children.find(byLogoLink);

    return (
      <nav
        class="nav"
        onKeyDown={this.onKeyDown}
        onClick={this.onClick}
        aria-expanded={this.expanded}
      >
        {menuToggle && (
          <div class={styles.toggle} innerHTML={menuToggle.outerHTML} />
        )}

        {logoLink && <div class={styles.logo} innerHTML={logoLink.outerHTML} />}

        <ul class="nav__list">
          {this.children.filter(byMenuItems).map(child => {
            const className =
              "nav__item" +
              (styles[child.slot] ? " " + styles[child.slot] : "");

            return <li innerHTML={child.outerHTML} class={className} />;
          })}
        </ul>

        {searchBox && (
          <div class={styles.search} innerHTML={searchBox.outerHTML} />
        )}
      </nav>
    );
  }
}
