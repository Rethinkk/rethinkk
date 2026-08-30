"use client";

import { FormEvent, useState } from "react";
import { categories } from "@/lib/content";
import { getLatestPublishedEdition } from "@/lib/democracy-index";
import { DemocracyImportDesk } from "@/components/democracy-import-desk";

export function DeskClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState("");

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("email") === "admin@rethinkk.org" && form.get("password") === "rethinkk") {
      setAuthenticated(true);
      setMessage("Signed in to the editorial desk.");
      return;
    }
    setMessage("Access denied for this prototype.");
  }

  if (!authenticated) {
    return (
      <div className="desk-grid desk-login-grid">
        <form className="panel" onSubmit={signIn}>
          <div className="field"><label htmlFor="desk-email">Email</label><input id="desk-email" name="email" type="email" required placeholder="admin@rethinkk.org" /></div>
          <div className="field"><label htmlFor="desk-password">Password</label><input id="desk-password" name="password" type="password" required placeholder="Password" /></div>
          <div className="button-row"><button className="solid-btn" type="submit">Sign in</button></div>
          {message && <p className="form-note">{message}</p>}
        </form>
        <div className="panel">
          <div className="kicker muted">Prototype access</div>
          <p className="copy">Demo credentials for this local version:</p>
          <p className="lede desk-credentials">admin@rethinkk.org<br /><span className="yellow">rethinkk</span></p>
          <p className="copy">In production this becomes a real authenticated admin area with roles for owner, editor, author and reviewer.</p>
        </div>
      </div>
    );
  }

  const democracyEdition = getLatestPublishedEdition();

  return (
    <div className="desk-stack">
      <div className="desk-grid desk-login-grid">
        <form className="panel">
          <div className="field"><label htmlFor="desk-title">Title</label><input id="desk-title" defaultValue="A new institutional question" /></div>
          <div className="field"><label htmlFor="desk-excerpt">Excerpt</label><textarea id="desk-excerpt" defaultValue="Short, evidence-led context for a new RETHINKK publication." /></div>
          <div className="field"><label htmlFor="desk-type">Type</label><select id="desk-type"><option>thinking</option><option>data</option><option>index</option><option>methodology</option></select></div>
          <div className="field"><label htmlFor="desk-category">Category</label><select id="desk-category">{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
          <div className="field"><label htmlFor="desk-priority">Homepage priority</label><select id="desk-priority"><option>Normal</option><option>Lead story</option><option>Secondary story</option></select></div>
          <div className="button-row"><button className="solid-btn" type="button">Save draft</button></div>
        </form>
        <div className="panel">
          <div className="kicker muted">Current session</div>
          <p className="lede">Publishing desk, not website builder.</p>
          <p className="copy">This is now a client-side prototype of the future CMS. The production version should store content in PostgreSQL and gate access with real roles.</p>
          <div className="desk-index-module">
            <div className="kicker yellow">Democracy Direction Index</div>
            <p className="copy">Manage annual editions, country assessments, dimensions, confidence, sources and review state.</p>
            <div className="desk-action-grid">
              <button className="ghost-btn" type="button">Create edition</button>
              <button className="ghost-btn" type="button">Duplicate {democracyEdition?.year || "previous"} baseline</button>
              <button className="ghost-btn" type="button">Import CSV / JSON</button>
              <button className="ghost-btn" type="button">Preview edition</button>
            </div>
          </div>
          <div className="button-row"><button className="ghost-btn" type="button" onClick={() => setAuthenticated(false)}>Sign out</button></div>
        </div>
      </div>
      <DemocracyImportDesk year={democracyEdition?.year || 2026} />
    </div>
  );
}
