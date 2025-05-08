import styles from "./index.module.scss";

import logoUrl from "../../assets/images/pharos-logo-simple.png";

import "../Logo";

class NavigationBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  private async render() {
    this.innerHTML += `
    <div class=${styles["navigation-bar"]}>
    <logo-component href="/home/index.html" src=${logoUrl}></logo-component>
        <div class=${styles.info}>
          <i class="bi bi-person-circle fs-5"></i>
          <p><span class="font-bold">${"userId"}</span> 님</p>
        </div>
        <button class="btn btn-dark btn-sm ${styles["logout-button"]}" type="button">
          <i class="bi bi-box-arrow-right"></i>
          Log out
        </button>
      </div>
    `;
  }
}

customElements.define("navigation-bar-component", NavigationBar);

export default NavigationBar;
