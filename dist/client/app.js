(function () {
  const database = structuredClone(window.RETHINKK_CONTENT);
  const stored = JSON.parse(localStorage.getItem("rethinkk-publications") || "null");
  if (Array.isArray(stored)) database.publications = stored;

  const main = document.getElementById("main");
  const navButtons = [...document.querySelectorAll(".primary-nav [data-route]")];

  const state = {
    filter: "All",
    search: "",
    deskAuthenticated: localStorage.getItem("rethinkk-desk-session") === "active"
  };

  function isActive(item) {
    if (item.status !== "published") return false;
    if (!item.featuredUntil) return true;
    return new Date(item.featuredUntil) >= new Date(database.settings.today);
  }

  function published() {
    return database.publications
      .filter((item) => item.status === "published")
      .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
  }

  function activeRanked(type) {
    return published()
      .filter((item) => !type || item.type === type)
      .filter(isActive)
      .sort((a, b) => {
        const priorityA = a.heroPriority || 99;
        const priorityB = b.heroPriority || 99;
        if (priorityA !== priorityB) return priorityA - priorityB;
        return (b.editorialWeight || 0) - (a.editorialWeight || 0);
      });
  }

  function sourceById(id) {
    return database.sources.find((source) => source.id === id);
  }

  function getRelated(item) {
    return (item.relatedContent || [])
      .map((id) => database.publications.find((publication) => publication.id === id))
      .filter(Boolean);
  }

  function pathFor(item) {
    if (item.type === "thinking") return `/thinking/${item.slug}`;
    if (item.type === "data") return `/data/${item.slug}`;
    if (item.type === "index") return `/indices/${item.slug}`;
    if (item.type === "methodology") return `/methodology/${item.slug}`;
    return `/archive/${item.slug}`;
  }

  function slugify(value) {
    return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function categoryPath(category) {
    return `/category/${slugify(category)}`;
  }

  function categoryFromPath(path) {
    const slug = path.replace("/category/", "");
    return database.categories.find((category) => slugify(category) === slug);
  }

  function navigate(path) {
    history.pushState(null, "", `#${path}`);
    render();
  }

  function route() {
    return location.hash.replace(/^#/, "") || "/";
  }

  function setNav(path) {
    navButtons.forEach((button) => {
      const target = button.dataset.route;
      const current = target === "/" ? path === "/" : path.startsWith(target);
      button.setAttribute("aria-current", current ? "page" : "false");
    });
  }

  function button(label, path, className = "text-link") {
    return `<button class="${className}" data-route="${path}">${label}</button>`;
  }

  function pageActions(secondary) {
    return `
      <div class="page-actions">
        ${button("<- Home", "/", "back-link")}
        ${secondary ? button(secondary.label, secondary.path, "back-link muted-link") : ""}
      </div>
    `;
  }

  function card(item) {
    return `
      <article class="card">
        <div class="kicker muted">${item.category}</div>
        <h3>${item.title}</h3>
        <p class="copy">${item.excerpt}</p>
        <div class="meta muted">${item.publicationDate} / ${item.type}</div>
        ${button("Read ->", pathFor(item))}
      </article>
    `;
  }

  function renderCategorySpine() {
    return `
      <section class="section compact-section">
        <div class="section-inner">
          <div class="section-head">
            <div>
              <div class="kicker yellow">Fields</div>
              <h2>Six areas. One standard.</h2>
            </div>
            <div class="kicker muted">Categories feed the archive, not the other way around</div>
          </div>
          <div class="category-spine">
            ${database.categories.map((category) => {
              const count = published().filter((item) => item.category === category).length;
              return `
                <button class="category-tile" data-route="${categoryPath(category)}">
                  <span>${category}</span>
                  <strong>${count}</strong>
                </button>
              `;
            }).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function chart(dataset) {
    const width = 620;
    const height = 250;
    const pad = 28;
    const values = dataset.map((point) => point.value);
    const min = Math.min(...values) - 10;
    const max = Math.max(...values) + 10;
    const x = (index) => pad + index * ((width - pad * 2) / (dataset.length - 1));
    const y = (value) => height - pad - ((value - min) / (max - min)) * (height - pad * 2);
    const points = dataset.map((point, index) => `${x(index)},${y(point.value)}`).join(" ");
    const circles = dataset.map((point, index) => `<circle cx="${x(index)}" cy="${y(point.value)}" r="4"><title>${point.year}: ${point.value}</title></circle>`).join("");
    return `
      <div class="chart" aria-label="Data chart">
        <svg viewBox="0 0 ${width} ${height}" role="img">
          <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="#353535"/>
          <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="#353535"/>
          <line x1="${pad}" y1="${height / 2}" x2="${width - pad}" y2="${height / 2}" stroke="#202020"/>
          <polyline points="${points}" fill="none" stroke="#eedc00" stroke-width="2"/>
          <g fill="#eedc00">${circles}</g>
        </svg>
        <div class="chart-labels meta muted"><span>${dataset[0].year}</span><span>${dataset[dataset.length - 1].year}</span></div>
      </div>
    `;
  }

  function renderHome() {
    const ranked = activeRanked();
    const hero = ranked.find((item) => item.heroPriority === 1) || ranked[0];
    const secondary = ranked.filter((item) => item.id !== hero.id).slice(0, 3);
    const data = activeRanked("data")[0];
    const index = activeRanked("index")[0];
    const heroLines = hero.title
      .replace("Europe is not small. It just talks as if it is.", "Europe is <br>not small. <br><span class=\"yellow\">It just talks <br>as if it is.</span>");
    return `
      <section class="section hero">
        <div class="section-inner">
          <div class="kicker muted">Featured thinking / ${hero.category} / ${database.settings.today}</div>
        </div>
        <div class="section-inner hero-grid">
          <div>
            <h1>${heroLines}</h1>
          </div>
          <div class="hero-summary">
            <p>${hero.excerpt}</p>
            ${button("Read thinking ->", pathFor(hero))}
          </div>
        </div>
      </section>
      <section class="section">
        <div class="section-inner">
          <div class="section-head">
            <div>
              <div class="kicker yellow">Thinking</div>
              <h2>Question what we know.</h2>
            </div>
            <div class="kicker muted">Latest analysis and essays</div>
          </div>
          <div class="story-grid">${secondary.map(card).join("")}</div>
        </div>
      </section>
      ${renderCategorySpine()}
      <section class="section">
        <div class="section-inner split-grid">
          <div>
            <div class="kicker yellow">Rethinkk Index</div>
            <h2 class="display-title">${index.title.replace(" 2026", "<br><span class='yellow'>2026</span>")}</h2>
            <p class="lede">${index.subtitle.replace("direction.", "<span class='yellow'>direction.</span>")}</p>
            ${button("Explore the index ->", pathFor(index))}
          </div>
          ${renderIndexPanel(index)}
        </div>
      </section>
      <section class="section">
        <div class="section-inner split-grid">
          <div>
            <div class="kicker yellow">Data</div>
            <h2 class="display-title">Less noise.<br>More <span class="yellow">context.</span></h2>
            <p class="copy">${data.hypothesis}</p>
            ${button("Explore data ->", pathFor(data))}
          </div>
          <div class="panel">
            <div class="status-row">
              <div>
                <div class="kicker muted">Example data note</div>
                <p class="lede">${data.title}</p>
              </div>
              <div class="kicker yellow">Structured data</div>
            </div>
            ${chart(data.dataset)}
          </div>
        </div>
      </section>
      ${renderAuthorInvitation()}
      <section class="section">
        <div class="section-inner">
          <div class="kicker yellow">About RETHINKK</div>
          <p class="page-title">Not left. Not right. <span class="yellow">Evidence-led.</span></p>
          ${button("Why RETHINKK ->", "/about")}
        </div>
      </section>
    `;
  }

  function renderIndexPanel(index) {
    const counts = index.countries.reduce((all, country) => {
      all[country.direction] = (all[country.direction] || 0) + 1;
      return all;
    }, {});
    return `
      <div class="panel index-panel">
        <div>
          <div class="kicker muted">Status / direction / velocity</div>
          <div class="status-grid">
            <div class="status-cell"><span class="status-symbol">↓</span><div class="kicker muted">Deteriorating ${counts.deteriorating || 0}</div></div>
            <div class="status-cell"><span class="status-symbol yellow">↑</span><div class="kicker muted">Improving ${counts.improving || 0}</div></div>
            <div class="status-cell"><span class="status-symbol">→</span><div class="kicker muted">Stable ${counts.stable || 0}</div></div>
          </div>
        </div>
        ${index.countries.slice(0, 4).map((country) => `
          <div class="metric-row">
            <span>${country.country}</span>
            <span class="muted">${country.institutionalScore} / ${country.direction}</span>
          </div>
          <div class="bar"><span style="width:${country.institutionalScore}%"></span></div>
        `).join("")}
      </div>
    `;
  }

  function renderListing(type, title, intro) {
    const items = published().filter((item) => item.type === type);
    return `
      <section class="section">
        <div class="section-inner">
          ${pageActions()}
          <div class="kicker yellow">${type}</div>
          <h1 class="page-title">${title}</h1>
          <p class="lede">${intro}</p>
          <div class="archive-list">${items.map((item) => archiveItem(item)).join("")}</div>
        </div>
      </section>
    `;
  }

  function renderCategoryPage(category) {
    const items = published().filter((item) => item.category === category);
    return `
      <section class="section">
        <div class="section-inner">
          ${pageActions({ label: "<- Archive", path: "/archive" })}
          <div class="kicker yellow">Category</div>
          <h1 class="page-title">${category}</h1>
          <p class="lede">This page is fed automatically by every published RETHINKK item assigned to this category.</p>
          <div class="archive-list">${items.map((item) => archiveItem(item)).join("") || "<p class='copy'>No publications in this category yet.</p>"}</div>
        </div>
      </section>
    `;
  }

  function archiveItem(item) {
    return `
      <article class="archive-item">
        <button data-route="${pathFor(item)}">
          <span class="meta muted">${item.publicationDate}</span>
          <span>
            <h3>${item.title}</h3>
            <span class="copy">${item.excerpt}</span>
          </span>
          <span class="meta yellow">${item.type}</span>
        </button>
      </article>
    `;
  }

  function renderArchive() {
    const categories = ["All", ...database.categories];
    const filtered = published().filter((item) => {
      const byCategory = state.filter === "All" || item.category === state.filter;
      const haystack = `${item.title} ${item.excerpt} ${item.category} ${(item.tags || []).join(" ")}`.toLowerCase();
      return byCategory && haystack.includes(state.search.toLowerCase());
    });
    return `
      <section class="section">
        <div class="section-inner">
          ${button("<- Home", "/", "back-link")}
          <div class="kicker yellow">Archive</div>
          <h1 class="page-title">What has RETHINKK published?</h1>
          <p class="lede">Everything remains available after it leaves the homepage. The archive answers a different question than the front page.</p>
          <div class="field" style="max-width:520px">
            <label for="archive-search">Search</label>
            <input id="archive-search" value="${state.search}" placeholder="Search title, topic or category">
          </div>
          <div class="filters">${categories.map((category) => `<button class="filter-btn" data-filter="${category}" aria-pressed="${state.filter === category}">${category}</button>`).join("")}</div>
          <div class="archive-list">${filtered.map(archiveItem).join("") || "<p class='copy'>No publications match this view.</p>"}</div>
        </div>
      </section>
    `;
  }

  function renderArticle(item) {
    const sources = (item.sources || []).map(sourceById).filter(Boolean);
    return `
      <article class="section">
        <div class="section-inner">
          ${pageActions({ label: "<- Archive", path: "/archive" })}
          <div class="kicker yellow">${item.type} / ${item.category}</div>
          <h1 class="article-title">${item.title}</h1>
          <p class="lede">${item.subtitle || item.excerpt}</p>
          <div class="meta muted">${item.author || "RETHINKK"} / ${item.publicationDate}</div>
          ${item.type === "data" && item.dataset ? `<div class="panel" style="margin-top:38px">${chart(item.dataset)}<p class="copy">${item.methodology}</p></div>` : ""}
          ${item.type === "index" ? renderCountryList(item) : ""}
          ${item.sections ? `
            <div class="article-body">
              <div class="evidence-grid">
                ${Object.entries(item.sections).map(([key, value]) => `
                  <section class="evidence-block">
                    <h3>${key}</h3>
                    <p>${value}</p>
                  </section>
                `).join("")}
              </div>
            </div>
          ` : `<div class="article-body"><p>${item.excerpt}</p></div>`}
          ${sources.length ? `<h2 class="display-title" style="font-size:32px;margin-top:42px">Sources</h2><ul class="source-list">${sources.map((source) => `<li>${source.organisation} / ${source.title} / ${source.sourceType}</li>`).join("")}</ul>` : ""}
          ${renderRelated(item)}
        </div>
      </article>
    `;
  }

  function renderCountryList(index) {
    return `
      <div class="panel" style="margin-top:38px">
        <div class="kicker muted">Country assessments / ${index.currentEdition}</div>
        <ul class="country-list">
          ${index.countries.map((country) => `
            <li class="country-item">
              <div class="status-row">
                <strong>${country.country}</strong>
                <span class="yellow">${country.institutionalScore}</span>
              </div>
              <div class="metric-row meta muted"><span>${country.status}</span><span>${country.direction} / ${country.velocity} velocity / change ${country.change}</span></div>
              <div class="bar"><span style="width:${country.institutionalScore}%"></span></div>
            </li>
          `).join("")}
        </ul>
      </div>
    `;
  }

  function renderRelated(item) {
    const related = getRelated(item);
    if (!related.length) return "";
    return `
      <section style="margin-top:48px">
        <div class="kicker yellow">Related content</div>
        <div class="story-grid" style="margin-top:18px">${related.map(card).join("")}</div>
      </section>
    `;
  }

  function renderAbout() {
    return `
      <section class="section">
        <div class="section-inner">
          ${pageActions()}
          <div class="kicker yellow">About</div>
          <h1 class="page-title">Rethink knowledge.</h1>
          <p class="lede">RETHINKK is an institutional identity for independent research, analysis and interpretation.</p>
          <div class="evidence-grid article-body">
            <section class="evidence-block"><h3>We are</h3><p>Clear, evidence-led, concise, curious, independent and prepared to conclude.</p></section>
            <section class="evidence-block"><h3>We are not</h3><p>Activist by default, partisan, sensationalist, performatively neutral, verbose or afraid of disagreement.</p></section>
          </div>
          <p class="page-title" style="font-size:clamp(34px,5vw,58px)">We don't shout. <span class="yellow">We present.</span></p>
        </div>
      </section>
    `;
  }

  function renderAuthorInvitation() {
    return `
      <section class="section compact-section">
        <div class="section-inner split-grid">
          <div>
            <div class="kicker yellow">Author network</div>
            <h2 class="display-title">Help rethink what we think we know.</h2>
          </div>
          <div>
            <p class="copy">RETHINKK grows by adding people who can research carefully, write clearly and separate evidence from interpretation.</p>
            ${button("Become a co-author ->", "/authors")}
          </div>
        </div>
      </section>
    `;
  }

  function renderAuthors() {
    return `
      <section class="section">
        <div class="section-inner">
          ${pageActions()}
          <div class="kicker yellow">Authors</div>
          <h1 class="page-title">Become a RETHINKK co-author.</h1>
          <p class="lede">RETHINKK publishes people who can question accepted knowledge, work from evidence and still be prepared to reach a conclusion.</p>
          <div class="desk-grid" style="margin-top:42px">
            <div>
              <p class="copy">The author network should grow slowly and deliberately. A co-author does not need to agree with every RETHINKK position, but must respect the distinction between evidence, interpretation and assessment.</p>
              <div class="author-standard">
                <div class="standard-item"><strong>Evidence</strong><p class="copy">Claims should be traceable to data, sources, method or direct observation.</p></div>
                <div class="standard-item"><strong>Clarity</strong><p class="copy">Writing should reduce noise rather than add performance to public arguments.</p></div>
                <div class="standard-item"><strong>Judgement</strong><p class="copy">Neutral tone does not mean avoiding a conclusion when the evidence supports one.</p></div>
              </div>
            </div>
            <form id="author-form" class="panel">
              <div class="field"><label for="author-name">Name</label><input id="author-name" required placeholder="Full name"></div>
              <div class="field"><label for="author-email">Email</label><input id="author-email" type="email" required placeholder="name@example.com"></div>
              <div class="field"><label for="author-category">Primary category</label><select id="author-category">${database.categories.map((category) => `<option>${category}</option>`).join("")}</select></div>
              <div class="field"><label for="author-expertise">Expertise</label><input id="author-expertise" required placeholder="Policy, economics, law, data, history..."></div>
              <div class="field"><label for="author-sample">Writing or research sample</label><input id="author-sample" placeholder="https://"></div>
              <div class="field"><label for="author-motivation">Why RETHINKK?</label><textarea id="author-motivation" required placeholder="What question would you like to examine?"></textarea></div>
              <div class="button-row">
                <button class="solid-btn" type="submit">Submit interest</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  function renderDesk() {
    if (!state.deskAuthenticated) return renderDeskLogin();
    const hero = activeRanked()[0];
    return `
      <section class="section">
        <div class="section-inner">
          ${pageActions()}
          <div class="kicker yellow">Editorial desk</div>
          <h1 class="page-title">Publishing desk, not website builder.</h1>
          <p class="lede">This local prototype shows the future CMS logic: create a publication, make it lead story, and the homepage changes without editing page markup.</p>
          <div class="desk-grid" style="margin-top:40px">
            <form id="desk-form" class="panel">
              <div class="field"><label for="desk-title">Title</label><input id="desk-title" required value="A new institutional question"></div>
              <div class="field"><label for="desk-excerpt">Excerpt</label><textarea id="desk-excerpt" required>Short, evidence-led context for a new RETHINKK publication.</textarea></div>
              <div class="field"><label for="desk-type">Type</label><select id="desk-type"><option>thinking</option><option>data</option><option>index</option><option>methodology</option></select></div>
              <div class="field"><label for="desk-category">Category</label><select id="desk-category">${database.categories.map((category) => `<option>${category}</option>`).join("")}</select></div>
              <div class="field"><label for="desk-priority">Homepage priority</label><select id="desk-priority"><option value="">Normal</option><option value="1">Lead story</option><option value="2">Secondary story</option><option value="3">Secondary story</option></select></div>
              <div class="button-row">
                <button class="solid-btn" type="submit">Publish draft</button>
                <button class="ghost-btn" type="button" id="reset-content">Reset local content</button>
              </div>
            </form>
            <div class="panel">
              <div class="kicker muted">Current lead</div>
              <p class="lede">${hero.title}</p>
              <div class="source-row"><span class="meta muted">Prominence expires</span><span class="meta yellow">${hero.featuredUntil || "Automatic"}</span></div>
              <div class="source-row"><span class="meta muted">Published records</span><span class="meta yellow">${published().length}</span></div>
              <div class="source-row"><span class="meta muted">Homepage source</span><span class="meta yellow">content layer</span></div>
              <div class="button-row">
                <button class="ghost-btn" type="button" id="desk-logout">Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderDeskLogin() {
    return `
      <section class="section">
        <div class="section-inner">
          ${pageActions()}
          <div class="kicker yellow">Editorial desk</div>
          <h1 class="page-title">Private publishing desk.</h1>
          <p class="lede">The public site is the publication. The desk is the internal layer for drafts, sources, homepage prominence and publishing control.</p>
          <div class="desk-grid" style="margin-top:40px">
            <form id="desk-login-form" class="panel">
              <div class="field"><label for="desk-email">Email</label><input id="desk-email" type="email" required placeholder="admin@rethinkk.org"></div>
              <div class="field"><label for="desk-password">Password</label><input id="desk-password" type="password" required placeholder="Password"></div>
              <div class="button-row">
                <button class="solid-btn" type="submit">Sign in</button>
              </div>
            </form>
            <div class="panel">
              <div class="kicker muted">Prototype access</div>
              <p class="copy">Demo credentials for this local version:</p>
              <p class="lede" style="font-size:22px">admin@rethinkk.org<br><span class="yellow">rethinkk</span></p>
              <p class="copy">In production this becomes a real authenticated admin area with roles for owner, editor, author and reviewer.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function savePublication(event) {
    event.preventDefault();
    const title = document.getElementById("desk-title").value.trim();
    const excerpt = document.getElementById("desk-excerpt").value.trim();
    const type = document.getElementById("desk-type").value;
    const category = document.getElementById("desk-category").value;
    const priority = document.getElementById("desk-priority").value;
    if (priority === "1") {
      database.publications.forEach((item) => {
        if (item.heroPriority === 1) item.heroPriority = 0;
      });
    }
    database.publications.unshift({
      id: `local-${Date.now()}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      type,
      status: "published",
      title,
      subtitle: "New publication created in the local editorial desk.",
      excerpt,
      category,
      tags: [category.split(" ")[0].toLowerCase()],
      author: "RETHINKK",
      publicationDate: database.settings.today,
      heroPriority: priority ? Number(priority) : 0,
      featuredUntil: priority ? "2026-09-05" : undefined,
      editorialWeight: priority ? 100 : 40,
      relatedContent: []
    });
    localStorage.setItem("rethinkk-publications", JSON.stringify(database.publications));
    toast("Publication saved locally. Homepage logic has been recalculated.");
    navigate(priority === "1" ? "/" : "/archive");
  }

  function signInDesk(event) {
    event.preventDefault();
    const email = document.getElementById("desk-email").value.trim().toLowerCase();
    const password = document.getElementById("desk-password").value;
    if (email === "admin@rethinkk.org" && password === "rethinkk") {
      state.deskAuthenticated = true;
      localStorage.setItem("rethinkk-desk-session", "active");
      toast("Signed in to the editorial desk.");
      render();
      return;
    }
    toast("Access denied for this prototype.");
  }

  function signOutDesk() {
    state.deskAuthenticated = false;
    localStorage.removeItem("rethinkk-desk-session");
    toast("Signed out of the editorial desk.");
    render();
  }

  function saveAuthorApplication(event) {
    event.preventDefault();
    const application = {
      name: document.getElementById("author-name").value.trim(),
      email: document.getElementById("author-email").value.trim(),
      category: document.getElementById("author-category").value,
      expertise: document.getElementById("author-expertise").value.trim(),
      sample: document.getElementById("author-sample").value.trim(),
      motivation: document.getElementById("author-motivation").value.trim(),
      submittedAt: new Date().toISOString()
    };
    const applications = JSON.parse(localStorage.getItem("rethinkk-author-applications") || "[]");
    applications.unshift(application);
    localStorage.setItem("rethinkk-author-applications", JSON.stringify(applications));
    event.target.reset();
    toast("Author interest saved locally for the prototype.");
  }

  function toast(message) {
    let element = document.querySelector(".toast");
    if (!element) {
      element = document.createElement("div");
      element.className = "toast";
      document.body.appendChild(element);
    }
    element.textContent = message;
    element.classList.add("show");
    setTimeout(() => element.classList.remove("show"), 3000);
  }

  function render() {
    const path = route();
    setNav(path);
    let html = "";
    const detail = published().find((item) => path === pathFor(item));
    const category = path.startsWith("/category/") ? categoryFromPath(path) : null;
    if (detail) html = renderArticle(detail);
    else if (category) html = renderCategoryPage(category);
    else if (path === "/") html = renderHome();
    else if (path === "/thinking") html = renderListing("thinking", "Question what we know.", "Essays, analysis and observations across democracy, economics, migration, society, Europe, geopolitics and power.");
    else if (path === "/data") html = renderListing("data", "Put the claim next to the numbers.", "Compact, sourced visual evidence designed to clarify public arguments.");
    else if (path === "/indices") html = renderListing("index", "Democracy is not a status.", "Indices are independent research products inside RETHINKK, designed to support future editions and country profiles.");
    else if (path === "/archive") html = renderArchive();
    else if (path === "/authors") html = renderAuthors();
    else if (path === "/about") html = renderAbout();
    else if (path === "/desk") html = renderDesk();
    else html = renderArchive();
    main.innerHTML = html;
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    bind();
  }

  function bind() {
    document.querySelectorAll("[data-route]").forEach((element) => {
      element.addEventListener("click", () => navigate(element.dataset.route));
    });
    document.querySelectorAll("[data-filter]").forEach((element) => {
      element.addEventListener("click", () => {
        state.filter = element.dataset.filter;
        render();
      });
    });
    const search = document.getElementById("archive-search");
    if (search) {
      search.addEventListener("input", (event) => {
        state.search = event.target.value;
        render();
        document.getElementById("archive-search").focus();
      });
    }
    const deskForm = document.getElementById("desk-form");
    if (deskForm) deskForm.addEventListener("submit", savePublication);
    const deskLoginForm = document.getElementById("desk-login-form");
    if (deskLoginForm) deskLoginForm.addEventListener("submit", signInDesk);
    const deskLogout = document.getElementById("desk-logout");
    if (deskLogout) deskLogout.addEventListener("click", signOutDesk);
    const authorForm = document.getElementById("author-form");
    if (authorForm) authorForm.addEventListener("submit", saveAuthorApplication);
    const reset = document.getElementById("reset-content");
    if (reset) {
      reset.addEventListener("click", () => {
        localStorage.removeItem("rethinkk-publications");
        toast("Local content reset.");
        location.reload();
      });
    }
  }

  window.addEventListener("popstate", render);
  render();
})();
