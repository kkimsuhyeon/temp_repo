import "../../includes/common-entry";

import "../../components/NavigationBar";
import "../../components/SideBar";

class Home {
  private element: HTMLElement | null;

  constructor() {
    this.element = document.getElementById("home-app");

    this.render();
  }

  private render() {
    if (!this.element) return;

    this.element.innerHTML += `
    <div>
      <navigation-bar-component></navigation-bar-component>
      <side-bar-component></side-bar-component>
    </div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Home();
});
