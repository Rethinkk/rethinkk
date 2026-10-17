import { Edition } from "./model";
export function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return `"${text.replace(/"/g, '""')}"`;
}
export function editionCsv(edition: Edition) {
  const rows: unknown[][] = [
    [
      "edition",
      "assessment_id",
      "leader",
      "country",
      "office",
      "period_start",
      "period_end",
      "dimension",
      "score",
      "total_available",
      "rationale",
      "source_id",
      "source_title",
      "source_author",
      "publisher",
      "publication_date",
      "source_type",
      "reference",
      "accessed_date",
      "language",
      "source_summary",
      "provenance",
      "reliability",
      "relevance",
      "archive",
      "claim",
      "relation",
      "context",
    ],
  ];
  for (const a of edition.assessments)
    for (const score of a.scores) {
      const links = a.evidence.filter((e) => e.dimension === score.dimension);
      for (const e of links.length ? links : [null]) {
        const s = e ? a.sources.find((s) => s.id === e.sourceId) : undefined;
        rows.push([
          edition.slug,
          a.id,
          a.leader.name,
          a.leader.country,
          a.leader.office,
          a.periodStart,
          a.periodEnd,
          score.dimension,
          score.score,
          a.scores.every((s) => s.score !== null),
          score.rationale,
          s?.id,
          s?.title,
          s?.author,
          s?.publisher,
          s?.publishedDate,
          s?.type,
          s?.reference,
          s?.accessedDate,
          s?.language,
          s?.summary,
          s?.provenance,
          s?.reliability,
          s?.relevance,
          s?.archive,
          e?.claim,
          e?.relation,
          e?.context,
        ]);
      }
    }
  return "\uFEFF" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
}
