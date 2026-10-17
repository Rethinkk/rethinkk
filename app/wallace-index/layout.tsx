import Link from "next/link";
import "./wallace.css";
export default function WallaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wi" lang="en-GB">
      <nav className="wi-nav" aria-label="Wallace Index chapter">
        {[
          ["Overview", ""],
          ["Explore", "explore"],
          ["Compare", "compare"],
          ["Your assessment", "assess"],
          ["Methodology", "methodology"],
          ["Sources", "sources"],
          ["Editions", "editions"],
          ["About", "about"],
        ].map(([title, path]) => (
          <Link key={title} href={`/wallace-index${path ? `/${path}` : ""}`}>
            {title}
          </Link>
        ))}
      </nav>
      {children}
      <footer className="wi-endnote">
        <p>
          The Wallace Index is a research-informed qualitative framework. It is
          not a peer-reviewed or academically validated instrument. Scores
          express contextual editorial assessments, not objective facts or
          definitive judgements of character.
        </p>
        <Link href="/wallace-index/about#corrections">
          Corrections, criticism and research contributions →
        </Link>
      </footer>
    </div>
  );
}
