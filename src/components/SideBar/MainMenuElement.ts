import styles from "./mainMenuElement.module.scss";

class MainMenuElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    let active = true;

    const activeString = this.getAttribute("active");
    const name = this.getAttribute("name");

    if (activeString && activeString === "true") active = true;

    this.innerHTML += `
    <li class='${active ? "active" : ""}'>
            <a href="#" class="main-menu-item">
                <span class="nav-label">${name}</span>
                <span class="fa arrow"></span>
			      </a>
            <ul class="nav nav-second-level ${active ? "in" : "collapse"}">
                <slot></slot>
            </ul>
        </li>
    `;
  }
}

customElements.define("main-menu-element-component", MainMenuElement);

export default MainMenuElement;
