import styles from "./index.scss?inline";

class Logo extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = styles;

    shadow.appendChild(style);
  }

  connectedCallback() {
    if (!this.shadowRoot) return;

    const href = this.getAttribute("href");
    const src = this.getAttribute("src");

    if (!src) return;

    const img = document.createElement("img");
    img.src = src;
    img.alt = "logo";
    img.setAttribute("part", "logo-image");

    if (href) {
      const link = document.createElement("a");
      link.href = href;
      link.appendChild(img);
      this.shadowRoot.appendChild(link);
    } else {
      this.shadowRoot.appendChild(img);
    }
  }
}

customElements.define("logo-component", Logo);

export default Logo;
