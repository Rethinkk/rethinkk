"use client";

import Link from "next/link";
import { PageActions, Section } from "@/components/site";
import { democracyDirectionEditions } from "@/lib/democracy-index";

export default function DemocracyDirectionIndexPage() {
  const editions = democracyDirectionEditions.filter((item) => item.status === "published").sort((a, b) => b.year - a.year);
  const current = editions[0];

  return (
    <Section>
      <div className="section-inner">
        <PageActions />
        <div className="kicker yellow">RETHINKK Index</div>
        <h1 className="page-title">Democracy Direction Index.</h1>
        <p className="lede">Current and historic annual editions. Published editions remain accessible and are not overwritten.</p>
        {current && (
          <div className="edition-archive">
            <Link className="archive-feature" href={`/index/democracy-direction/${current.year}`}>
              <span className="kicker yellow">Current edition</span>
              <strong>{current.year}</strong>
              <span>{current.subtitle}</span>
            </Link>
            <div>
              <div className="kicker muted">Past editions</div>
              <p className="copy">Past editions will appear here once later years are published.</p>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
