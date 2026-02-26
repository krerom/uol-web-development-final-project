# University of London - Web Development Final Project — Template Engine & SPA

A single-page application about **Internet History Austria**, built around a small **client-side template engine**. The app fetches HTML templates and JSON content from a Node/Express backend, then renders them into fixed layout sections using custom Web Components and a minimal template syntax.

---

## How It Works

1. **Shell:** `index.html` is the only full page. It loads base styles and scripts, and contains a single `<div id="main">` where every “page” is rendered.
2. **Routing:** The current page is determined by the URL hash (e.g. `#early`, `#reference`) or path. Internal links use hashes; the app listens for `hashchange` and re-renders.
3. **Per “page”:** The client requests the **template** (HTML fragment) and **content** (JSON) for that page from the API, injects the template into `#main`, then runs the template engine on the `#content` section and fills the fixed slots (`#navigation`, `#footer`, optional sliders).
4. **Template engine:** Runs in the browser (`main.js`). It replaces `{{variable}}` with values from the page’s JSON and expands `{{foreach key}} … {{endfor}}` over arrays. Placeholders like `{{image}}` and `{{links}}` are turned into `<t-img>` and `<a>` markup.
5. **Components:** Navigation, footer, and sliders are created by JS (NavBar, Footer, Slider). Layout and typography use custom elements: `t-headline`, `t-text`, `t-space`, `t-button`, `t-dual-box`, `t-img`.

The engine is intentionally minimal: a small set of render targets and a simple syntax to keep behaviour predictable and layout consistent.

---

## Project Structure

```
code/
├── index.html              # App shell; #main is the render target
├── assets/images/          # Images used in content and UI
├── utils/
│   ├── styles/
│   │   └── styles.css      # Base (global) styles for the whole app
│   └── scripts/
│       ├── main.js         # Routing, API calls, template engine (renderBlocks)
│       └── Components/
│           └── components.js  # NavBar, Footer, Slider + custom elements
└── server/                 # Backend API
    ├── server.js           # Express: templates, data, pages, styles
    ├── conf/
    │   ├── pages.json      # Page id → name, destination, html, optional css
    │   └── content.json    # Page id → title, heading, blocks, sliders, etc.
    ├── templates/          # HTML fragments (home.html, template.html, reference.html)
    └── styles/             # Optional per-page CSS (home.css, reference.css)
```

---

## Styles: Base vs Per-Page

- **Base styles** live in **`utils/styles/styles.css`** and are linked in `index.html`. They apply to every page (layout, navigation, footer, typography, variables, etc.).
- **Template-based pages** (e.g. early, mid, present) use **only** this base stylesheet. They have no `css` entry in `pages.json` and do not load extra CSS.
- **Per-page styles** are optional. If a page has a `css` field in `pages.json` (e.g. `home.css`, `reference.css`), that file is fetched from the server and injected into the document when that page is shown. So: base styles are global; extra styles are attached dynamically only when needed.

---

## Template Syntax

- **Variable:** `{{variableName}}` — replaced with the value from the page’s content JSON (e.g. `{{heading}}`, `{{title}}`).
- **Loop:** `{{foreach key}} … {{endfor}}` — repeats the block for each item in `data.key` (e.g. `{{foreach blocks}}`). Inside the block, `{{title}}`, `{{text}}`, etc. refer to the current item.
- **Special placeholders (inside a loop):**
  - `{{image}}` — if the item has `image`, becomes `<t-img src="assets/images/…" alt="…">`; otherwise empty.
  - `{{links}}` — if the item has `links`, becomes a series of `<a href="…">…</a>`.

Templates are HTML fragments. Fixed sections:

- `#navigation` — filled by the NavBar component from `pages.json`.
- `#content` — inner HTML is processed by `renderBlocks(template, data)`.
- `#footer` — filled by the Footer component from `content.json` (key `footer`).
- Any element id listed in a page’s `sliders` (e.g. `#slider1`) is filled by the Slider component.

---

## Backend API

The Express server (run from `server/`) serves:

| Endpoint            | Description |
|---------------------|-------------|
| `GET /pages`        | Full `pages.json` (all pages for nav). |
| `GET /template/:page` | HTML template for `page` (e.g. `home`, `early`). |
| `GET /data/:page`   | Content JSON for `page` (and `footer` for `page` = `footer`). |
| `GET /styles/:page` | Optional per-page CSS; 404 if the page has no `css` in `pages.json`. |

Page ids and which template/CSS to use come from `server/conf/pages.json`. Actual content comes from `server/conf/content.json`.

---

## Run the Project

1. **Backend:** From the `server/` directory run `npm install` then `npm start`. The API listens on port **5000**.
2. **Frontend:** Serve the **project root** (`code/`) over HTTP (e.g. with your editor’s “Live Server”, or `npx serve .` from `code/`). Open the site’s URL (e.g. `http://127.0.0.1:3000/` or `http://localhost:5500/`).  
   The client fetches templates and data from `http://localhost:5000`; CORS is enabled on the server.

---

## Tech Stack

- **Frontend:** Vanilla JS, Web Components (custom elements), hash-based SPA routing.
- **Backend:** Node.js, Express, static file/config reading (`fs`).
- **Data:** JSON only (`pages.json`, `content.json`); no database.

---

## Content

The site presents a short history of the internet in Austria (late 1990s to present), with a home page, time-period pages (1999–2010, 2011–2020, 2021–present) using the data-driven template, and a reference page. Footer and navigation are shared and driven by config and content JSON.
