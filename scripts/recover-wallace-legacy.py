#!/usr/bin/env python3
"""Recover a provenance-preserving research archive without executing legacy code.

Usage: python scripts/recover-wallace-legacy.py /path/to/legacy.git output-directory
Only reachable Git objects are read. No database, website or remote is modified.
"""
import csv
import hashlib
import html
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

REPO = "https://github.com/Rethinkk/wallace-index"
CANONICAL = ["People", "Process", "Policy", "Crisis", "Humility", "Service"]
ALTERNATIVE = ["Service to People", "Integrity", "Policy over Popularity", "Crisis Management", "Humility", "Process Orientation"]
LABEL = "Recovered legacy prototype — not an approved RETHINKK assessment."
EXPECTED_IMPORTS = ["wallace_index_poc_legacy_import.json", "wallace_index_poc_legacy_import.csv"]


def recover(repository, destination):
    repository, destination = Path(repository).resolve(), Path(destination).resolve()
    destination.mkdir(parents=True, exist_ok=True)

    def git(*args):
        return subprocess.check_output(["git", "-C", str(repository), *args])

    def write_json(path, value):
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    def sha256(raw):
        return hashlib.sha256(raw).hexdigest()

    commits = git("rev-list", "--all", "--topo-order", "--reverse").decode().splitlines()
    if not commits:
        raise RuntimeError("No reachable history found")
    head = git("rev-parse", "HEAD").decode().strip()
    refs = [dict(zip(["ref", "commit"], line.split(" ", 1))) for line in git("for-each-ref", "--format=%(refname) %(objectname)").decode().splitlines()]
    commit_records = []
    versions = {}
    current = {}
    deletions = []
    for commit in commits:
        authored, committed, subject, body = git("show", "-s", "--format=%aI%x00%cI%x00%s%x00%b", commit).decode().rstrip("\n").split("\0", 3)
        commit_records.append({"sha": commit, "authored_at": authored, "committed_at": committed, "subject": subject, "body": body, "url": f"{REPO}/commit/{commit}"})
        for line in git("ls-tree", "-r", commit).decode().splitlines():
            meta, path = line.split("\t", 1)
            mode, kind, blob = meta.split()
            if kind != "blob":
                raise RuntimeError(f"Unexpected non-blob entry: {path}")
            if Path(path).is_absolute() or ".." in Path(path).parts:
                raise RuntimeError("Unsafe legacy file path")
            versions.setdefault((path, blob), {"id": f"{blob}:{path}", "original_path": path, "git_blob_sha": blob, "mode": mode, "present_in_commits": []})["present_in_commits"].append(commit)
            if commit == head:
                current[path] = blob
        parent = git("rev-list", "--parents", "-n", "1", commit).decode().split()[1:]
        if parent:
            for path in git("diff", "--name-only", "--diff-filter=D", parent[0], commit).decode().splitlines():
                old_blob = git("rev-parse", f"{parent[0]}:{path}").decode().strip()
                deletions.append({"path": path, "deletion_commit": commit, "recover_from_commit": parent[0], "git_blob_sha": old_blob})

    raw_by_source = {}
    for source in versions.values():
        raw = git("cat-file", "blob", source["git_blob_sha"])
        archive_path = Path("evidence") / source["git_blob_sha"] / source["original_path"]
        target = destination / archive_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(raw)
        source.update({"archive_path": archive_path.as_posix(), "sha256": sha256(raw), "byte_length": len(raw), "first_seen_commit": source["present_in_commits"][0], "last_seen_commit": source["present_in_commits"][-1], "present_at_inspected_head": current.get(source["original_path"]) == source["git_blob_sha"], "url": f"{REPO}/blob/{source['present_in_commits'][0]}/{source['original_path']}"})
        raw_by_source[source["id"]] = raw.decode("utf-8")

    observations = []
    def observe(source, name, labels, values, method, start, end, excerpt, details=None):
        assert len(labels) == len(values)
        source_text = raw_by_source[source["id"]]
        lines = [source_text.count("\n", 0, start) + 1, source_text.count("\n", 0, end) + 1]
        observations.append({"id": f"observation-{len(observations)+1:03}", "leader_name_as_recorded": name, "leader_id": "keir-starmer" if name in ["Keir Starmer", "Starmer", "starmer"] else "boris-johnson", "methodology_id": "legacy-six-names" if labels == CANONICAL else "legacy-alternative-names", "dimensions": [{"original_label": d, "original_numeric_value": v, "dimension_rationale": None} for d, v in zip(labels, values)], "extraction_method": method, "extraction_details": details, "provenance": {"source_id": source["id"], "original_path": source["original_path"], "commit_sha": source["first_seen_commit"], "git_blob_sha": source["git_blob_sha"], "lines": lines, "url": source["url"] + f"#L{lines[0]}", "original_excerpt": excerpt}, "original_stated_total": None, "original_stated_maximum": None, "original_rationale": None, "original_research_sources": [], "assessment_date_or_period": None})

    pattern_rows = re.compile(r'\{\s*(?:category|label):\s*[\'\"]([^\'\"]+)[\'\"],\s*(?:Starmer|starmer):\s*(\d+),\s*(?:Johnson|johnson):\s*(\d+)\s*\}')
    svg_notes = []
    for source in versions.values():
        text = raw_by_source[source["id"]]
        path = source["original_path"]
        if path.endswith(".html"):
            for match in re.finditer(r"<h2>\s*(Keir Starmer|Boris Johnson)\s*</h2>\s*<p>([^<]+)</p>", text):
                pairs = re.findall(r"(People|Process|Policy|Crisis|Humility|Service):\s*(\d+)", match.group(2))
                if pairs:
                    observe(source, match.group(1), [d for d, _ in pairs], [int(v) for _, v in pairs], "literal_html_text", match.start(), match.end(), match.group())
            # Explicitly labelled values in the partial three-category inline chart.
            partial = re.findall(r'<text[^>]*>(Service to People|Integrity|Policy over Popularity)</text>\s*<rect[^>]+/>\s*<text[^>]*>Starmer: (\d+)</text>\s*<rect[^>]+/>\s*<text[^>]*>Johnson: (\d+)</text>', text)
            if partial:
                start, end = text.index("<svg"), text.index("</svg>") + 6
                for index, name in [(1, "Starmer"), (2, "Johnson")]:
                    observe(source, name, [r[0] for r in partial], [int(r[index]) for r in partial], "literal_inline_svg_text", start, end, text[start:end], {"partial_display": True, "missing_dimensions_not_inferred_from_other_files": True})
        if path.endswith(".js"):
            if "dataStarmer" in text:
                for match in re.finditer(r"const (dataStarmer|dataBoris)\s*=\s*\{([\s\S]*?)\n\};", text):
                    names = re.search(r"labels:\s*\[([^\]]+)\]", match.group(2))
                    title = re.search(r"label:\s*'([^']+)'", match.group(2))
                    numbers = re.search(r"data:\s*\[([^\]]+)\]", match.group(2))
                    observe(source, title.group(1), re.findall(r"'([^']+)'", names.group(1)), [int(v.strip()) for v in numbers.group(1).split(",")], "literal_javascript_array", match.start(), match.end(), match.group())
            rows = list(pattern_rows.finditer(text))
            if rows:
                for index, name in [(2, "Starmer"), (3, "Johnson")]:
                    observe(source, name, [r.group(1) for r in rows], [int(r.group(index)) for r in rows], "literal_javascript_objects", rows[0].start(), rows[-1].end(), text[rows[0].start():rows[-1].end()], {"javascript_executed": False, "rendering_not_verified": True})
        # Recover SVG geometry from the standalone file and the embedded duplicate.
        match = re.search(r"<svg\b[\s\S]*?</svg>", text)
        if match and "Matplotlib" in match.group():
            svg = match.group()
            root = ET.fromstring(svg)
            namespace = {"s": "http://www.w3.org/2000/svg"}
            ticks = []
            for tick in re.finditer(r'<g id="ytick_\d+">([\s\S]*?)(?=<g id="ytick_|<g id="text_17")', svg):
                val = re.search(r"<!--\s*([\d.]+)\s*-->", tick.group())
                point = re.search(r'd="M\s+[\d.]+\s+([\d.]+)', tick.group())
                if val and point:
                    ticks.append((float(val.group(1)), float(point.group(1))))
            assert len(ticks) == 9
            zero_y, last_y = ticks[0][1], ticks[-1][1]
            units_per_pixel = (ticks[-1][0] - ticks[0][0]) / (zero_y - last_y)
            bars = []
            for i in range(3, 15):
                node = root.find(f".//s:g[@id='patch_{i}']/s:path", namespace)
                coords = re.findall(r"[ML]\s*([\d.]+)\s+([\d.]+)", node.get("d"))
                numeric = (zero_y - min(float(y) for _, y in coords)) * units_per_pixel
                nearest = round(numeric)
                assert abs(numeric - nearest) < 0.000001
                bars.append(nearest)
            for i, name in [(0, "Keir Starmer"), (1, "Boris Johnson")]:
                values = bars[i*6:(i+1)*6]
                observe(source, name, CANONICAL, values, "inferred_from_svg_geometry", match.start(), match.end(), match.group(), {"formula": "(zero_tick_y - bar_top_y) * units_per_pixel", "zero_tick_y": zero_y, "units_per_pixel": units_per_pixel, "bar_groups": "patch_3–patch_8" if i == 0 else "patch_9–patch_14", "zero_score_geometry_preserved": True, "display_axis_minimum": 0, "display_axis_maximum": 4, "maximum_rounding_residual_below": 0.000001, "uncertainty": "Values inferred from chart geometry and legend, not literal numerical scores in the SVG; they agree with separately recovered literal arrays. The 0–4 display axis does not establish a scoring rubric or maximum."})
            svg_notes.append({"source_id": source["id"], "generation_timestamp_as_recorded": re.search(r"<dc:date>(.*?)</dc:date>", svg).group(1), "timestamp_timezone": None, "assessment_date_inferred": False, "display_axis": [0, 4]})

    # Group identical values and dimension sets, retaining each occurrence as provenance.
    records = {}
    for o in observations:
        key = json.dumps([o["leader_id"], o["methodology_id"], o["dimensions"]], sort_keys=True)
        if key not in records:
            flags = ["legacy_prototype_not_approved", "assessment_period_missing", "original_total_missing", "explicit_scoring_scale_missing", "rationale_missing", "supporting_research_sources_missing", "political_office_missing"]
            if len(o["dimensions"]) < 6:
                flags.append("partial_display_do_not_fill_missing_scores")
            records[key] = {"id": f"legacy-assessment-{len(records)+1:03}", "label": LABEL, "leader_id": o["leader_id"], "methodology_id": o["methodology_id"], "historical_methodology_version_as_recorded": None, "original_name_forms": [], "dimensions": o["dimensions"], "original_stated_total": None, "original_stated_maximum": None, "calculated_arithmetic_sum": sum(d["original_numeric_value"] for d in o["dimensions"]), "calculation_scope": "six recorded dimensions" if len(o["dimensions"]) == 6 else "partial three-dimension display only; not a complete total", "current_model_total": None, "assessment_date_or_period": None, "original_written_assessment": None, "original_research_sources": [], "observation_ids": [], "editorial_review_flags": flags, "editorial_status": "recovered_for_review_only"}
        record = records[key]
        record["observation_ids"].append(o["id"])
        if o["leader_name_as_recorded"] not in record["original_name_forms"]:
            record["original_name_forms"].append(o["leader_name_as_recorded"])
        o["assessment_record_id"] = record["id"]
    records = list(records.values())

    countries = []
    for source in versions.values():
        text = raw_by_source[source["id"]]
        if "UK Leadership Profiles" in text:
            countries.append({"source_id": source["id"], "original_text": "Wallace Index – UK Leadership Profiles", "evidence_scope": "shared heading; not an individual country field"})
    leaders = [{"id": leader_id, "name_as_recorded": name, "full_legal_name": None, "country_as_recorded": "UK", "country_evidence_scope": "shared page heading", "country_provenance": countries, "political_office": None, "assessment_date_or_period": None, "assessment_record_ids": [r["id"] for r in records if r["leader_id"] == leader_id], "identity_note": "Surname/code-key aliases are linked to the full display name using paired HTML/JavaScript profiles; no external biographical enrichment was added."} for leader_id, name in [("keir-starmer", "Keir Starmer"), ("boris-johnson", "Boris Johnson")]]
    methods = [{"id": mid, "version_as_recorded": None, "original_dimension_labels": dims, "explicit_scale_minimum": None, "explicit_scale_maximum": None, "explicit_total_maximum": None, "documented_score_definitions": None, "documented_evidence_requirements": None, "observed_value_range": [min(d["original_numeric_value"] for o in observations if o["methodology_id"] == mid for d in o["dimensions"]), max(d["original_numeric_value"] for o in observations if o["methodology_id"] == mid for d in o["dimensions"])], "current_model_comparison": comparison, "mapping_to_current_dimensions": None, "source_ids": sorted({o["provenance"]["source_id"] for o in observations if o["methodology_id"] == mid}), "editorial_note": "Recovery identifier only; this was not a named/versioned historical methodology. Observed ranges do not establish the intended scale."} for mid, dims, comparison in [("legacy-six-names", CANONICAL, "The six labels and order match the current model, but the original rubric and intended maximum are not documented. Do not assume historical validation or approval."), ("legacy-alternative-names", ALTERNATIVE, "Different labels and observed values up to 9; incompatible with direct import into current 0–3 fields. A three-label partial display also exists. No automatic mapping or normalisation is proposed.")]]
    conflicts = [{"id": "conflict-001", "leader_id": "boris-johnson", "type": "same-label numerical change", "details": "In charts.js, the alternative-label dataset changes Crisis Management from 2 to 3 and Humility from 1 to 2. Earlier values remain in Git history; no rationale is documented.", "older_blob": "3f9edfa628bd23916d4e592295defbb1de49142a", "later_blob": "9d1b48e67efa1a9c4684ef20d4378df0e7b21702", "resolution": "Preserve both; editorial review required."}, {"id": "conflict-002", "leader_id": None, "type": "simultaneous methodology mismatch", "details": "The latest index.html retains the six current-name scores while the linked charts.js uses alternative labels and larger values. Do not select one as an approved assessment or treat them as directly comparable.", "commit_sha": head, "resolution": "Keep separate methodology families and provenance."}, {"id": "conflict-003", "leader_id": None, "type": "display axis versus undocumented scale", "details": "The deleted Matplotlib SVG has a 0–4 vertical axis; the literal canonical dataset contains 0–3 values. Neither establishes an explicit scoring rubric or a documented historical maximum.", "resolution": "Keep scale and maximum null; preserve display-axis metadata."}]
    missing = [{"filename": f, "status": "not_provided_or_located", "comparison_status": "pending", "searched_locations": ["accessible legacy Git history", "main RETHINKK tracked history and fetched references", "workspace filename search including attachments"], "next_action": "Provide the actual provisional file; reconcile it against this archive without overwriting either."} for f in EXPECTED_IMPORTS]
    links = []
    for source in versions.values():
        for link in sorted(set(re.findall(r'https?://[^\s\'\"<>]+', raw_by_source[source["id"]]))):
            links.append({"source_id": source["id"], "url_as_recorded": link, "classification": "technical_or_format_reference_not_research_evidence"})
    created_at = datetime.now(timezone.utc).isoformat()
    coverage = {"repository": REPO, "inspected_head": head, "refs": refs, "reachable_commit_count": len(commits), "earliest_authored_at": min(c["authored_at"] for c in commit_records), "latest_authored_at": max(c["authored_at"] for c in commit_records), "unique_file_version_count": len(versions), "historical_paths": sorted({p for p, _ in versions}), "current_paths": sorted(current), "deletion_event_count": len(deletions), "limitations": ["Only server-accessible references and their reachable objects can be inspected; inaccessible deleted branches, reflogs and garbage-collected objects are not recoverable from this clone.", "Commit dates and SVG generation metadata are not assessment dates.", "No provisional import file was supplied or located; comparison remains pending.", "No external biographical enrichment, factual score verification or new assessments were performed."]}
    archive = {"schema_version": "1.0", "project": "The Wallace Index", "assignment": "Research Recovery Assignment 01", "created_at": created_at, "label": LABEL, "publication_eligible": False, "coverage": coverage, "summary_counts": {"leaders": len(leaders), "distinct_assessment_records": len(records), "complete_six_dimension_value_variants": sum(len(r["dimensions"]) == 6 for r in records), "partial_display_variants": sum(len(r["dimensions"]) < 6 for r in records), "methodology_label_families": len(methods), "source_observations": len(observations), "original_rationales": 0, "original_supporting_research_references": 0}, "leaders": leaders, "methodology_variants": methods, "assessments": records, "observations": observations, "svg_metadata": svg_notes, "original_generic_text": [{"text": "This is a comparison between Keir Starmer and Boris Johnson based on Wallace principles.", "interpretation": "Generic interface description, not an assessment rationale.", "source_ids": [s["id"] for s in versions.values() if "This is a comparison between Keir Starmer and Boris Johnson based on Wallace principles." in raw_by_source[s["id"]]]}], "original_research_sources": [], "technical_links_not_research_evidence": links, "later_editorial_commentary": [{"author": "Recovery audit", "text": "The surviving material records prototype numerical comparisons, not a documented evidence-backed research trail. It cannot support official publication without new research, contextualisation and review."}], "conflicts": conflicts, "provisional_import_comparison": missing}
    write_json(destination / "wallace-legacy-recovered.json", archive)
    manifest = {"schema_version": "1.0", "created_at": created_at, "coverage": coverage, "commits": commit_records, "deletions": deletions, "file_versions": list(versions.values())}
    write_json(destination / "wallace-legacy-source-manifest.json", manifest)
    with (destination / "wallace-legacy-recovered.csv").open("w", newline="", encoding="utf-8") as f:
        fields = ["assessment_id", "label", "leader_id", "leader_name", "country_as_recorded", "political_office", "assessment_date_or_period", "methodology_id", "original_dimension_label", "original_dimension_score", "original_stated_total", "calculated_arithmetic_sum", "calculation_scope", "original_stated_maximum", "current_model_total", "original_rationale", "original_research_sources", "source_files", "commit_shas", "git_blob_shas", "observation_ids", "provenance", "editorial_review_flags"]
        writer = csv.DictWriter(f, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        for record in records:
            obs = [o for o in observations if o["id"] in record["observation_ids"]]
            leader = next(l for l in leaders if l["id"] == record["leader_id"])
            for dimension in record["dimensions"]:
                writer.writerow({"assessment_id": record["id"], "label": LABEL, "leader_id": leader["id"], "leader_name": leader["name_as_recorded"], "country_as_recorded": "UK", "political_office": "", "assessment_date_or_period": "", "methodology_id": record["methodology_id"], "original_dimension_label": dimension["original_label"], "original_dimension_score": dimension["original_numeric_value"], "original_stated_total": "", "calculated_arithmetic_sum": record["calculated_arithmetic_sum"], "calculation_scope": record["calculation_scope"], "original_stated_maximum": "", "current_model_total": "", "original_rationale": "", "original_research_sources": "[]", "source_files": json.dumps(sorted({o["provenance"]["original_path"] for o in obs})), "commit_shas": json.dumps(sorted({o["provenance"]["commit_sha"] for o in obs})), "git_blob_shas": json.dumps(sorted({o["provenance"]["git_blob_sha"] for o in obs})), "observation_ids": json.dumps(record["observation_ids"]), "provenance": json.dumps([o["provenance"]["url"] for o in obs]), "editorial_review_flags": json.dumps(record["editorial_review_flags"])})
    with (destination / "wallace-legacy-import-comparison.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["import_file", "leader", "assessment_id", "field_compared", "repository_value", "provisional_import_value", "provenance", "status", "required_editorial_action"], lineterminator="\n")
        writer.writeheader()
        for item in missing:
            writer.writerow({"import_file": item["filename"], "leader": "", "assessment_id": "", "field_compared": "file_availability", "repository_value": "not present in accessible legacy history", "provisional_import_value": "", "provenance": f"repository HEAD {head}; complete reachable tree inventory in source manifest", "status": "pending_missing_import_file", "required_editorial_action": item["next_action"]})
    print(json.dumps({"destination": str(destination), "coverage": coverage, "counts": archive["summary_counts"]}, indent=2))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    recover(sys.argv[1], sys.argv[2])
