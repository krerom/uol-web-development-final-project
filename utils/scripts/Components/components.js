function NavBar(data, navBarSection) {
    this.data = data
    this.navBarPos = navBarSection;

    this.create = function () {
        if (navBarSection.querySelector("nav")) {
            navBarSection.innerHTML = "";
        }
        const navBar = document.createElement("nav");

        // menu toggle (mobile)
        const menuToggle = document.createElement("button");
        menuToggle.classList.add("menu-toggle");
        const menuIcon = document.createElement("img");

        // using the URL instead of a static image 
        // enables me to change color
        menuIcon.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTQgNWgxNiIvPjxwYXRoIGQ9Ik00IDEyaDE2Ii8+PHBhdGggZD0iTTQgMTloMTYiLz48L3N2Zz4=";
        menuIcon.alt = "Menu";

        const menuText = document.createElement("span");
        menuText.textContent = "Menu";

        menuToggle.appendChild(menuIcon);
        menuToggle.appendChild(menuText);

        // continue PC layout
        const navBarContent = document.createElement("ul");

        Object.values(data).forEach(element => {
            const navItem = document.createElement("li");
            const link = document.createElement("a");
            link.href = element.destination;
            link.textContent = element.name;
            navItem.appendChild(link);
            navBarContent.appendChild(navItem);
        });

        navBar.appendChild(menuToggle);
        navBar.appendChild(navBarContent);
        navBarSection.appendChild(navBar);

        // toggle menu open/close
        menuToggle.addEventListener("click", () => {
            navBarContent.classList.toggle("open");
        });
    }
}

function Footer(data, footer) {
    this.data = data;
    this.footerPos = footer;

    this.create = function () {
        if (data) {
            if (!footer.classList.contains("footer")) footer.classList.add("footer");
            footer.innerHTML = "";

            if (data.classNames && data.classNames.length > 0) {
                data.classNames.forEach(cl => {
                    footer.classList.add(cl);
                });
            }

            const logoLinkWrapper = document.createElement("div");
            logoLinkWrapper.classList.add("logoLinkWrapper");

            if (data.logo || data.slogan) {
                const logoDiv = document.createElement("div");
                const logoContainer = document.createElement("div");

                if (data.logo) {
                    const logo = document.createElement("img");
                    logo.src = `assets/images/${data.logo}`;
                    logoContainer.appendChild(logo);
                }

                if (data.slogan) {
                    const slogan = document.createElement("span");
                    slogan.textContent = data.slogan;
                    logoContainer.appendChild(slogan);
                }
                logoContainer.classList.add("logoContainer");
                logoDiv.appendChild(logoContainer);
                logoLinkWrapper.appendChild(logoDiv);
            }

            if (data.links && data.links.length > 0) {
                const linksDiv = document.createElement("div");
                const linksContainer = document.createElement("div");
                data.links.forEach(link => {
                    const footerLink = document.createElement("a");
                    footerLink.classList.add("footerLink");
                    footerLink.textContent = link.text || ".";
                    footerLink.href = link.url || "/";
                    linksContainer.appendChild(footerLink);
                });
                linksContainer.classList.add("linksContainer");
                linksDiv.appendChild(linksContainer);
                logoLinkWrapper.appendChild(linksDiv);
            }

            footer.appendChild(logoLinkWrapper);

            if (data.footnote) {
                const footNoteCont = document.createElement("div");
                footNoteCont.textContent = data.footnote || ".";
                footNoteCont.classList.add("footNoteCont");
                footer.appendChild(footNoteCont);
            }
        }
    }
}


function Slider(data) {
    this.data = data;
    this.currImg = 0;

    this.create = function () {
        if (!data.id || !data.images || data.images.length === 0) return;

        const root = document.getElementById(data.id);
        root.innerHTML = "";
        root.classList.add("slider");

        if (data.classNames?.length) {
            data.classNames.forEach(c => root.classList.add(c));
        }

        if (this.data.title) {
            const sliderTitleElement = document.createElement("div");
            sliderTitleElement.classList.add("sliderTitle");

            const sliderTitle = document.createElement("h1");
            sliderTitle.textContent = this.data.title;

            sliderTitleElement.appendChild(sliderTitle)
            root.appendChild(sliderTitleElement);
        }

        const display = data.display || 1;

        // buttons
        const btnPrev = document.createElement("button");
        btnPrev.textContent = "‹";
        btnPrev.classList.add("slider-btn", "prev");

        const btnNext = document.createElement("button");
        btnNext.textContent = "›";
        btnNext.classList.add("slider-btn", "next");

        // viewport
        const viewport = document.createElement("div");
        viewport.classList.add("slider-viewport");

        // track
        const track = document.createElement("div");
        track.classList.add("slider-track");
        track.style.display = "flex";
        track.style.width = "100%";

        viewport.appendChild(track);
        root.append(btnPrev, viewport, btnNext);

        // store references
        this.track = track;
        this.display = display;

        // initial render
        this.render();

        // events
        btnNext.addEventListener("click", () => this.move(1));
        btnPrev.addEventListener("click", () => this.move(-1));
        window.addEventListener("resize", () => this.render());
    };

    this.move = function (dir) {
        const total = this.data.images.length;

        this.currImg = (this.currImg + dir + total) % total;
        this.render();
    };

    this.render = function () {
        const track = this.track;
        const total = this.data.images.length;

        // check screen width
        let display = this.display;
        if (window.innerWidth < 700) {
            display = 1;
        }

        track.innerHTML = "";

        for (let i = 0; i < display; i++) {
            const index = (this.currImg + i) % total;

            const img = document.createElement("img");
            img.src = `assets/images/${this.data.images[index]}`;
            img.alt = this.data.altTexts?.[index] || "";
            img.style.width = `${100 / display}%`;

            if (this.data.urls?.[index]) {
                const a = document.createElement("a");
                a.href = this.data.urls[index];
                a.appendChild(img);
                track.appendChild(a);
            } else {
                track.appendChild(img);
            }
        }
    };
}

class TemperatureBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.elmt = document.createElement("div");
        this.elmt.style.display = "flex";
        this.elmt.style.flexDirection = "column";
        this.elmt.style.background = "rgba(0, 0, 0, 0.4)"
        this.elmt.style.borderRadius = "10px";
        this.elmt.style.alignItems = "center";
        this.elmt.style.justifyContent = "center";
        this.elmt.style.width = "fit-content";
        this.elmt.style.padding = "1rem";

        this.shadowRoot.appendChild(this.elmt);
    }

    async connectedCallback() {
        this.render();
        await this.fetchWeather();
    }

    static get observedAttributes() {
        return ["lat", "lon", "title", "font", "size", "color"];
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        // Update the UI if attributes change
        if (name === "lat" || name === "lon") {
            await this.fetchWeather();
        }
        this.render();
    }

    async fetchWeather() {
        const lat = this.getAttribute("lat");
        const lon = this.getAttribute("lon");

        if (!lat || !lon) return;

        try {
            const response = await fetch(`http://localhost:5000/weather/${lat}/${lon}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                this.data = await response.text();
                this.render();
            }
        } catch (err) {
            console.error("Weather fetch failed:", err);
        }
    }

    render() {
        // Apply styles from attributes
        this.elmt.style.fontFamily = this.getAttribute("font") || "Outfit, sans-serif";
        this.elmt.style.fontSize = this.getAttribute("size") || "24px";
        this.elmt.style.color = this.getAttribute("color") || "black";

        // Clear and rebuild internal HTML
        this.elmt.innerHTML = `
            <div class="title">${this.getAttribute("title") || ''}</div>
            <div class="degrees">${this.data || '--'} °C</div>
        `;
    }
}
customElements.define("t-temperature", TemperatureBox);

class Headline extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        this.heading = document.createElement("span");

        this.heading.style.fontFamily = this.getAttribute("font") || "Outfit";
        this.heading.style.fontSize = this.getAttribute("size") || "24px";
        this.heading.style.color = this.getAttribute("color") || "black";
        this.heading.style.margin = "0";
        this.heading.style.lineHeight = "1.2";
        this.heading.style.display = "flex";

        this.heading.textContent = this.textContent;

        shadow.appendChild(this.heading);
    }

    // react to attribute changes
    static get observedAttributes() {
        return ["size", "color", "font"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "size") this.heading.style.fontSize = newValue;
        if (name === "color") this.heading.style.color = newValue;
        if (name === "font") this.heading.style.fontFamily = newValue;
    }
}
customElements.define("t-headline", Headline);

class TextBox extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });
        this.textBox = document.createElement("div");
        this.textBox.innerHTML = this.innerHTML;

        // CSS variables for desktop and phone sizes
        const style = document.createElement("style");
        style.textContent = `
            div {
                font-family: var(--font, ${this.getAttribute("font") || "Outfit"});
                font-size: var(--size, ${this.getAttribute("size") || "16px"});
                color: var(--color, ${this.getAttribute("color") || "black"});
                width: var(--width, ${this.getAttribute("width") || "fit-content"});
                height: var(--height, ${this.getAttribute("height") || "fit-content"});
                margin: 0;
                line-height: 1.2;
                display: flex;
            }

            @media (max-width: 600px) {
                div {
                    width: var(--width-phone, 90%) !important;
                    height: var(--height-phone, auto) !important;
                    margin: 0 auto !important;
                }
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(this.textBox);

        // initialize CSS variables from attributes
        this.updateCSSVariables();
    }

    static get observedAttributes() {
        return ["size", "color", "font", "width", "height", "width-phone", "height-phone"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.updateCSSVariables();
    }

    updateCSSVariables() {
        const style = this.textBox.style;
        style.setProperty("--font", this.getAttribute("font") || "Outfit");
        style.setProperty("--size", this.getAttribute("size") || "16px");
        style.setProperty("--color", this.getAttribute("color") || "black");
        style.setProperty("--width", this.getAttribute("width") || "fit-content");
        style.setProperty("--height", this.getAttribute("height") || "fit-content");
        style.setProperty("--width-phone", this.getAttribute("width-phone") || "90%");
        style.setProperty("--height-phone", this.getAttribute("height-phone") || "auto");
    }
}
customElements.define("t-text", TextBox);

class Spacing extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        this.spacing = document.createElement("div");
        this.spacing.style.minWidth = this.getAttribute("width") || "100%";
        this.spacing.style.minHeight = this.getAttribute("height") || "100%";


        shadow.appendChild(this.spacing);
    }

    static get observedAttributes() {
        return ["width", "height"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "width") this.spacing.style.minWidth = newValue;
        if (name === "height") this.spacing.style.minHeight = newValue;
    }
}
customElements.define("t-space", Spacing);

class Button extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        this.button = document.createElement("button");

        this.button.style.minWidth = this.getAttribute("width") || "100%";
        this.button.style.minHeight = this.getAttribute("height") || "100%";
        this.button.style.color = this.getAttribute("color") || "rgb(255,255,255)";
        this.button.style.backgroundColor = this.getAttribute("bg") || "black";
        this.button.style.borderRadius = this.getAttribute("borderR") || "10px";
        this.button.style.fontSize = this.getAttribute("fontSize") || "16px";
        this.button.style.fontFamily = this.getAttribute("fontFamily") || "sans-serif";

        this.button.textContent = this.textContent;
        shadow.appendChild(this.button);
    }

    static get observedAttributes() {
        return ["width", "height", "color", "bg", "borderR", "fontSize", "fontFamily"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "width") this.button.style.width = newValue;
        if (name === "height") this.button.style.height = newValue;
        if (name === "color") this.button.style.color = newValue;
        if (name === "bg") this.button.style.backgroundColor = newValue;
        if (name === "borderR") this.button.style.borderRadius = newValue;
        if (name === "fontSize") this.button.style.fontSize = newValue;
        if (name === "fontFamily") this.button.style.fontFamily = newValue;
    }
}
customElements.define("t-button", Button);

class DualBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        const wrapper = document.createElement("div");
        wrapper.classList.add("dual-box");

        const slot = document.createElement("slot");
        wrapper.appendChild(slot);

        const style = document.createElement("style");
        style.textContent = `
            .dual-box {
                display: flex;
                gap: 1rem;
                align-items: center;
            }

            @media (max-width: 768px) {
                .dual-box {
                    flex-direction: column;
                }
            }
        `;

        this.shadowRoot.append(style, wrapper);
    }
}
customElements.define("t-dual-box", DualBox);

class ImageBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("img"); // assign to this.wrapper
        this.wrapper.style.maxWidth = this.getAttribute("width") || "200px";
        this.wrapper.style.maxHeight = this.getAttribute("height") || "200px";
        this.wrapper.style.display = "block";

        this.shadowRoot.append(this.wrapper);
    }

    static get observedAttributes() {
        return ["width", "height", "src"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "width") this.wrapper.style.maxWidth = newValue;
        if (name === "height") this.wrapper.style.maxHeight = newValue;
        if (name === "src") this.wrapper.src = newValue;
    }
}
customElements.define("t-img", ImageBox);

class CommentSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.comments = [];
    }

    connectedCallback() {
        this.render();
        this.fetchComments();
    }

    get api() { return this.getAttribute("api-base") || ""; }
    get page() { return this.getAttribute("page") || "default"; }

    async fetchComments() {
        try {
            const res = await fetch(`${this.api}/comments/${this.page}`);
            this.comments = await res.json();
            this.render();
        } catch (e) {
            this.shadowRoot.querySelector('#list').innerHTML =
                `<div class="status">Failed to load.</div>`;
        }
    }

    async postComment(e) {
        e.preventDefault();
        const form = e.target;
        const fd = new FormData(form);
        const btn = form.querySelector('button');

        let username = fd.get("username") || localStorage.getItem("username");
        if (username !== localStorage.getItem("username")) {
            localStorage.setItem("username", username);
        }

        const comment = {
            page: this.page,
            username,
            text: fd.get('text'),
            timestamp: new Date().toISOString()
        };

        btn.disabled = true;
        try {
            const res = await fetch(`${this.api}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment })
            });
            if (res.ok) {
                this.comments.push(comment);
                this.render();
            }
        } finally {
            btn.disabled = false;
        }
    }

    render() {
        const username = localStorage.getItem("username") || "Username";
        this.shadowRoot.innerHTML = `
        <style>
            :host { 
                font-family: monospace; 
                display: flex;
                flex-direction: column; 
                color: #e8e6f0; 
                border: 1px solid #2e2e3e; 
                border-radius: 8px; 
                overflow: hidden; 
            }

            .header { 
                padding: 12px; 
                display: flex; 
                justify-content: space-between; 
                font-size: 13px; 
                font-weight: bold;
                color: #2e2e3e;
            }

            #list { 
                max-height: 500px; 
                overflow-y: auto; 
                padding: 12px; 
                display: flex; 
                flex-direction: column; 
                gap: 10px; /* space between comments */
            }

            .comment { 
                padding: 12px 14px; 
                border: 1px solid #2e2e3e; 
                border-radius: 10px; 
                display: flex; 
                flex-direction: column; 
                width: fit-content;
                gap: 4px;
                color: #2e2e3e;
            }

            .username { 
                color: #7c6af7; 
                font-weight: bold; 
                font-size: 13px; 
            }

            .text { 
                font-size: 13px; 
                opacity: 0.9; 
                white-space: pre-wrap; /* keep line breaks */
                word-break: break-word;
            }

            .composer { 
                padding: 12px; 
                display: flex; 
                flex-direction: column; 
                gap: 8px; 
                border-top: 1px solid #2e2e3e;
                color: #2e2e3e;
            }

            input, textarea { 
                border: 1px solid #3e3e4e; 
                color: #fff; 
                padding: 8px; 
                border-radius: 6px; 
                font-family: inherit;
                color: #2e2e3e;
            }

            button { 
                background: #7c6af7; 
                color: #fff; 
                border: none; 
                padding: 8px; 
                cursor: pointer; 
                font-weight: bold; 
                border-radius: 6px; 
                transition: background 0.15s;
            }

            button:hover { 
                background: #9d8fff; 
            }

            .status { 
                padding: 20px; 
                text-align: center; 
                color: #7a7890; 
                font-style: italic;
            }

            .timestamp {
                font-size: 11px;
                color: #8680a8;
                margin-top: 4px;
                opacity: 0.8;
            }
        </style>

        <div class="header">
            <span>// COMMENTS (${this.comments.length})</span>
            <span style="cursor:pointer" id="reload">↻ REFRESH</span>
        </div>

        <div id="list">
            ${this.comments.length
                ? this.comments.map(c => `
                    <div class="comment">
                        <div class="username">${c.username}</div>
                        <div class="text">${c.text}</div>
                        <div class="timestamp">${new Date(c.timestamp).toLocaleString()}</div>
                    </div>
                `).join('')
                : '<div class="status">No comments yet.</div>'
            }
        </div>

        <form class="composer" id="commentForm">
            <input name="username" placeholder="${username}" />
            <textarea name="text" placeholder="Write a comment..." required></textarea>
            <button type="submit">POST →</button>
        </form>
        `;

        const form = this.shadowRoot.querySelector('#commentForm');
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.postComment(e);
        });
        this.shadowRoot.querySelector('#reload').onclick = () => this.fetchComments();
    }
}
customElements.define("t-comments", CommentSection);