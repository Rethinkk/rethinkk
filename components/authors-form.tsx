"use client";

import { FormEvent, useState } from "react";
import { categories } from "@/lib/content";

export function AuthorsForm() {
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    event.currentTarget.reset();
  }

  return (
    <form className="panel" onSubmit={submit}>
      <div className="field"><label htmlFor="author-name">Name</label><input id="author-name" required placeholder="Full name" /></div>
      <div className="field"><label htmlFor="author-email">Email</label><input id="author-email" type="email" required placeholder="name@example.com" /></div>
      <div className="field"><label htmlFor="author-category">Primary category</label><select id="author-category">{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
      <div className="field"><label htmlFor="author-expertise">Expertise</label><input id="author-expertise" required placeholder="Policy, economics, law, data, history..." /></div>
      <div className="field"><label htmlFor="author-sample">Writing or research sample</label><input id="author-sample" placeholder="https://" /></div>
      <div className="field"><label htmlFor="author-motivation">Why RETHINKK?</label><textarea id="author-motivation" required placeholder="What question would you like to examine?" /></div>
      <div className="button-row"><button className="solid-btn" type="submit">Submit interest</button></div>
      {saved && <p className="form-note">Author interest saved for the prototype.</p>}
    </form>
  );
}
