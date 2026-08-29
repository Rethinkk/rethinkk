"use client";

import { useMemo, useState } from "react";
import { ArchiveItem } from "@/components/site";
import { categories, Publication } from "@/lib/content";

export function ArchiveClient({ items }: { items: Publication[] }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => items.filter((item) => {
    const byCategory = filter === "All" || item.category === filter;
    const text = `${item.title} ${item.excerpt} ${item.category} ${item.tags.join(" ")}`.toLowerCase();
    return byCategory && text.includes(search.toLowerCase());
  }), [filter, items, search]);

  return (
    <>
      <div className="field archive-search">
        <label htmlFor="archive-search">Search</label>
        <input id="archive-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, topic or category" />
      </div>
      <div className="filters">
        {["All", ...categories].map((category) => (
          <button className="filter-btn" key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>
        ))}
      </div>
      <div className="archive-list">
        {filtered.length ? filtered.map((item) => <ArchiveItem key={item.id} item={item} />) : <p className="copy">No publications match this view.</p>}
      </div>
    </>
  );
}
