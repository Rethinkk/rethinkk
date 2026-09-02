import Link from "next/link";
import { ReactNode } from "react";
import { publicationPath } from "@/lib/queries";
import { Publication } from "@/lib/content";

export function SiteHeader() {
  const nav = [
    ["Thinking", "/thinking"],
    ["Data", "/data"],
    ["Indices", "/indices"],
    ["Research", "/research"],
    ["Archive", "/archive"],
    ["Authors", "/authors"],
    ["About", "/about"]
  ];

  return (
    <header className="site-header">
      <Link className="brand-lockup" href="/" aria-label="RETHINKK home">
        <span className="wordmark">RETHINKK</span>
        <span className="brand-rule" aria-hidden="true" />
        <span className="brand-tagline">Rethink <span>knowledge.</span></span>
      </Link>
      <nav className="primary-nav" aria-label="Primary navigation">
        {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p><span>We don't shout.</span> <strong>We present.</strong></p>
      <p className="footer-domain">rethinkk.org</p>
    </footer>
  );
}

export function Section({ children, compact = false, className = "" }: { children: ReactNode; compact?: boolean; className?: string }) {
  return <section className={`section ${compact ? "compact-section" : ""} ${className}`}>{children}</section>;
}

export function PageActions({ archive = false }: { archive?: boolean }) {
  return (
    <div className="page-actions">
      <Link className="back-link" href="/">{"<- Home"}</Link>
      {archive && <Link className="back-link muted-link" href="/archive">{"<- Archive"}</Link>}
    </div>
  );
}

export function ArticleCard({ item }: { item: Publication }) {
  return (
    <article className="card">
      <div className="kicker muted">{item.category}</div>
      <h3>{item.title}</h3>
      <p className="copy">{item.excerpt}</p>
      <div className="meta muted">{item.publicationDate} / {item.type}</div>
      <Link className="text-link" href={publicationPath(item)}>Read -&gt;</Link>
    </article>
  );
}

export function ArchiveItem({ item }: { item: Publication }) {
  return (
    <article className="archive-item">
      <Link href={publicationPath(item)}>
        <span className="meta muted">{item.publicationDate}</span>
        <span>
          <h3>{item.title}</h3>
          <span className="copy">{item.excerpt}</span>
        </span>
        <span className="meta yellow">{item.type}</span>
      </Link>
    </article>
  );
}
