import "./MainMenuElement";
import "./SubMenuElement";

import styles from "./index.module.scss";

class SideBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML += `
    <div class="${styles["sidebar-wrap"]}">
        <nav class="navbar-default navbar-static-side" role="navigation">
            <div>
                <ul id="side-menu">
                    <main-menu-element-component type="main" name="test1234">
                        <sub-menu-element-component type="child"></sub-menu-element-component>
                        <sub-menu-element-component type="child"></sub-menu-element-component>
                        <sub-menu-element-component type="child"></sub-menu-element-component>
                    </main-menu-element-component>
                    <main-menu-element-component type="main" name="test1235">
                        <sub-menu-element-component type="child"></sub-menu-element-component>
                        <sub-menu-element-component type="child"></sub-menu-element-component>
                        <sub-menu-element-component type="child"></sub-menu-element-component>
                    </main-menu-element-component>
                </ul>
            </div>
        </nav>
    </div>
    `;
  }
}

customElements.define("side-bar-component", SideBar);

export default SideBar;
