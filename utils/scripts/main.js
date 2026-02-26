
// helper function to get all pages from pages.json
async function getPagesAPI() {
    try {
        const response = await fetch(`http://localhost:5000/pages`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            // creating an object from response
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

// helper function to get the content of a requested page
async function getDataAPI(currentPage) {
    // removing hash routes and renaming "/" to "home"
    let page = currentPage.replace("#", '').trim();
    if (currentPage == "/") page = "home";

    try {
        const response = await fetch(`http://localhost:5000/data/${page}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            // creating an object from response
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

// helper function to get the html template of a requested page
async function getTemplateAPI(currentPage) {
    // removing hash routes and renaming "/" to "home"
    let page = currentPage.replace("#", '').trim();
    if (currentPage == "/") page = "home";

    try {
        const response = await fetch(`http://localhost:5000/template/${page}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            // storing response as plain text
            const data = await response.text();
            return data;
        }
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

// helper function to get the css file for a requested page
async function loadCSS(currentPage) {
    // removing hash routes and renaming "/" to "home"
    let page = currentPage.replace("#", '').trim();
    if (currentPage == "/") page = "home";

    // checking f these styles have been applied already
    if (document.getElementById(`style-${page}`)) return;

    const response = await fetch(`http://localhost:5000/styles/${page}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) return;
    const css = await response.text();

    const style = document.createElement("style");
    // assigning an ID to the styles element to not duplicate
    style.id = `style-${page}`;
    style.textContent = css;
    // appending the style to index.html
    document.head.appendChild(style);
}

function renderBlocks(template, data) {
    const tokens = template.split(/(\{\{[^}]+\}\})/g);
    let output = "";

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // FOREACH START
        const foreachMatch = token.match(/\{\{foreach\s+(\w+)\}\}/);
        if (foreachMatch) {
            const key = foreachMatch[1]; // e.g., "blocks"
            let inner = "";

            i++; // move past foreach

            // collect until endfor
            while (!tokens[i].match(/\{\{endfor\}\}/)) {
                inner += tokens[i];
                i++;
            }

            // render inner block for each item
            data[key].forEach(item => {
                let innerRendered = inner.replace(/\{\{(\w+)\}\}/g, (_, v) => {
                    if (v === "image") {
                        return item.image
                            ? `<t-img src="assets/images/${item.image}" alt="${item.imageDescription || ""}"></t-img>`
                            : "";
                    }

                    if (v === "links") {
                        if (!item.links || item.links.length === 0) return "";
                        return item.links
                            .map(link => `<a href="${link.url}">${link.text}</a>`)
                            .join(" ");
                    }                    

                    return item[v] ?? "";
                });

                output += innerRendered;
            });

            continue;
        }

        // VARIABLE
        const varMatch = token.match(/\{\{(\w+)\}\}/);
        if (varMatch) {
            output += data[varMatch[1]] ?? "";
            continue;
        }

        // RAW HTML
        output += token;
    }
    return output;
}


async function renderContent(page, pages, mainBody) {
    // loading the html template for requested page
    const template = await getTemplateAPI(page);
    mainBody.innerHTML = template;

    await loadCSS(page);

    const pageData = await getDataAPI(page || "/");

    document.title = pageData.title || "Title";

    const navBarSection = document.getElementById("navigation");
    if (navBarSection) {
        const navBarElement = new NavBar(pages, navBarSection);
        navBarElement.create();
    }

    const cont = document.getElementById("content");
    if (cont) {
        const contInnerHtml = renderBlocks(cont.innerHTML, pageData);
        cont.innerHTML = contInnerHtml;
    }

    if (pageData.sliders && pageData.sliders.length > 0) {
        pageData.sliders.forEach(dt => {
            const sliderElement = new Slider(dt);
            sliderElement.create();
        });
    }

    const commentsSection = document.getElementById("comments");
    if (commentsSection) {
        // derive the page key the same way the rest of the app does
        let pageKey = page.replace("#", "").trim();
        if (page === "/") pageKey = "home";

        const commentsEl = document.createElement("t-comments");
        commentsEl.setAttribute("page", pageKey);
        commentsEl.setAttribute("api-base", "http://localhost:5000");
        commentsEl.setAttribute("max-height", commentsSection.dataset.maxHeight || "400px");
        if (commentsSection.dataset.theme) {
            commentsEl.setAttribute("theme", commentsSection.dataset.theme);
        }

        commentsSection.appendChild(commentsEl);
    }

    const footer = document.getElementById("footer");
    if (footer) {
        const footerData = await getDataAPI("footer");
        const footerElement = new Footer(footerData, footer);
        footerElement.create();
    }
}

// this gets executed when DOM is fully loaded 
document.addEventListener("DOMContentLoaded", async function () {
    if (window.location.pathname === "/index.html") {
        history.replaceState(null, "", "/");
    }

    // determining current page according to browser address bar
    let currentPage = window.location.hash || window.location.pathname || '/';

    // getting all pages for navigation
    const pages = await getPagesAPI();

    const mainBody = document.getElementById("main"); // main entry point

    // rendering the page
    renderContent(currentPage, pages, mainBody);

    // intercept all internal navigation
    document.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (link) {
            const href = link.getAttribute('href');

            if (href.startsWith("#")) {
                e.preventDefault();
                window.location.hash = href; // triggers hashchange 
            }
        }
    });

    // adding event listeners to control browser behavior
    window.addEventListener('hashchange', () => {
        const currentPage = window.location.hash || '/';
        renderContent(currentPage, pages, mainBody);
    });
    window.addEventListener('load', e => {
        const path = (e.state && e.state.path) || window.location.hash || window.location.pathname;
        renderContent(path, pages, mainBody);
    });
});