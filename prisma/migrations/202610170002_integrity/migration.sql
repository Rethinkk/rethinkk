-- Domain and historical-integrity constraints are deliberately enforced in PostgreSQL.
ALTER TABLE "WallaceUser" ADD CONSTRAINT "wallace_roles" CHECK ("roles" <@ ARRAY['administrator','researcher','reviewer','publisher']::text[]);
ALTER TABLE "WallaceAssessment" ADD CONSTRAINT "wallace_status" CHECK ("status" IN ('draft','in_review','approved','published','superseded','archived'));
ALTER TABLE "WallaceAssessment" ADD CONSTRAINT "wallace_period" CHECK ("periodStart" <= "periodEnd");
ALTER TABLE "WallaceAssessment" ADD CONSTRAINT "wallace_review_decision" CHECK ("reviewDecision" IN ('pending','accepted','changes_requested'));
ALTER TABLE "WallaceAssessment" ADD CONSTRAINT "wallace_author" FOREIGN KEY ("authorId") REFERENCES "WallaceUser"("id") ON DELETE RESTRICT;
ALTER TABLE "WallaceAssessment" ADD CONSTRAINT "wallace_reviewer" FOREIGN KEY ("reviewerId") REFERENCES "WallaceUser"("id") ON DELETE RESTRICT;
ALTER TABLE "WallaceAssessment" ADD CONSTRAINT "wallace_publisher" FOREIGN KEY ("approvedBy") REFERENCES "WallaceUser"("id") ON DELETE RESTRICT;
ALTER TABLE "WallaceReview" ADD CONSTRAINT "wallace_review_assessment" FOREIGN KEY ("assessmentId") REFERENCES "WallaceAssessment"("id") ON DELETE RESTRICT;
ALTER TABLE "WallaceDimensionScore" ADD CONSTRAINT "wallace_dimension" CHECK ("dimension" IN ('people','process','policy','crisis','humility','service'));
ALTER TABLE "WallaceDimensionScore" ADD CONSTRAINT "wallace_score" CHECK ("score" BETWEEN 0 AND 3);
ALTER TABLE "WallaceDimensionScore" ADD CONSTRAINT "wallace_sufficiency" CHECK (("score" IS NULL AND "sufficiency" IN ('insufficient','not_assessed')) OR ("score" IS NOT NULL AND "sufficiency" = 'sufficient'));
ALTER TABLE "WallaceEvidence" ADD CONSTRAINT "wallace_evidence_relation" CHECK ("relation" IN ('supporting','contradicting','qualifying'));
ALTER TABLE "WallaceEvidence" ADD CONSTRAINT "wallace_evidence_claim" CHECK (length(trim("claim")) > 0);
ALTER TABLE "WallaceSource" ADD CONSTRAINT "wallace_source_predecessor" FOREIGN KEY ("predecessorId") REFERENCES "WallaceSource"("id") ON DELETE RESTRICT;

CREATE FUNCTION wallace_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Historical record is immutable; create a documented revision'; END;
$$;
CREATE TRIGGER wallace_source_immutable BEFORE UPDATE OR DELETE ON "WallaceSource" FOR EACH ROW EXECUTE FUNCTION wallace_immutable();
CREATE TRIGGER wallace_edition_immutable BEFORE UPDATE OR DELETE ON "WallaceEdition" FOR EACH ROW EXECUTE FUNCTION wallace_immutable();
CREATE TRIGGER wallace_audit_immutable BEFORE UPDATE OR DELETE ON "WallaceAuditEvent" FOR EACH ROW EXECUTE FUNCTION wallace_immutable();
CREATE TRIGGER wallace_review_immutable BEFORE UPDATE OR DELETE ON "WallaceReview" FOR EACH ROW EXECUTE FUNCTION wallace_immutable();
CREATE TRIGGER wallace_membership_immutable BEFORE UPDATE OR DELETE ON "WallaceEditionAssessment" FOR EACH ROW EXECUTE FUNCTION wallace_immutable();

CREATE FUNCTION wallace_methodology_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD."approved" THEN RAISE EXCEPTION 'Approved methodology is immutable'; END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER wallace_methodology_immutable BEFORE UPDATE OR DELETE ON "WallaceMethodology" FOR EACH ROW EXECUTE FUNCTION wallace_methodology_guard();

CREATE FUNCTION wallace_assessment_guard() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE parent_status text; dimension_count integer;
BEGIN
  IF TG_TABLE_NAME = 'WallaceAssessment' THEN
    IF TG_OP <> 'INSERT' AND OLD."status" IN ('published','superseded','archived') THEN
      RAISE EXCEPTION 'Published assessment is immutable';
    END IF;
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
    IF TG_OP = 'INSERT' AND NEW."status" <> 'draft' THEN RAISE EXCEPTION 'New assessments must start in draft'; END IF;
    IF NEW."status" IN ('approved','published') THEN
      IF NEW."reviewDecision" <> 'accepted' OR NEW."reviewerId" IS NULL OR NEW."approvedBy" IS NULL OR NEW."reviewerId" = NEW."authorId" OR NEW."approvedBy" IN (NEW."authorId",NEW."reviewerId") THEN RAISE EXCEPTION 'Independent review and publisher approval required'; END IF;
      IF NOT EXISTS (SELECT 1 FROM "WallaceMethodology" WHERE id = NEW."methodologyId" AND approved) THEN RAISE EXCEPTION 'Approved methodology required'; END IF;
      SELECT count(*) INTO dimension_count FROM "WallaceDimensionScore" s WHERE s."assessmentId"=NEW.id AND s.score IS NOT NULL AND length(trim(s.rationale))>0 AND EXISTS (SELECT 1 FROM "WallaceEvidence" e WHERE e."assessmentId"=s."assessmentId" AND e.dimension=s.dimension AND e.relation='supporting');
      IF dimension_count <> 6 THEN RAISE EXCEPTION 'Six complete evidenced dimension scores required'; END IF;
    END IF;
  ELSE
    IF TG_OP <> 'INSERT' THEN
      SELECT status INTO parent_status FROM "WallaceAssessment" WHERE id=OLD."assessmentId";
      IF parent_status <> 'draft' THEN RAISE EXCEPTION 'Only draft assessment children may change'; END IF;
    END IF;
    IF TG_OP <> 'DELETE' THEN
      SELECT status INTO parent_status FROM "WallaceAssessment" WHERE id=NEW."assessmentId";
      IF parent_status <> 'draft' THEN RAISE EXCEPTION 'Only draft assessment children may change'; END IF;
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER wallace_assessment_history BEFORE INSERT OR UPDATE OR DELETE ON "WallaceAssessment" FOR EACH ROW EXECUTE FUNCTION wallace_assessment_guard();
CREATE TRIGGER wallace_score_history BEFORE INSERT OR UPDATE OR DELETE ON "WallaceDimensionScore" FOR EACH ROW EXECUTE FUNCTION wallace_assessment_guard();
CREATE TRIGGER wallace_evidence_history BEFORE INSERT OR UPDATE OR DELETE ON "WallaceEvidence" FOR EACH ROW EXECUTE FUNCTION wallace_assessment_guard();

CREATE FUNCTION wallace_content_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status='published' THEN RAISE EXCEPTION 'Published content needs a new revision'; END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER wallace_content_history BEFORE UPDATE OR DELETE ON "WallaceContent" FOR EACH ROW EXECUTE FUNCTION wallace_content_guard();
