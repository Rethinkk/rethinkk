CREATE FUNCTION wallace_membership_guard() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE edition_snapshot jsonb; methodology_id text; assessment_methodology text; assessment_leader text; assessment_status text;
BEGIN
  SELECT snapshot, "methodologyId" INTO edition_snapshot, methodology_id FROM "WallaceEdition" WHERE id=NEW."editionId";
  SELECT "methodologyId", "leaderId", status INTO assessment_methodology, assessment_leader, assessment_status FROM "WallaceAssessment" WHERE id=NEW."assessmentId";
  IF methodology_id IS DISTINCT FROM assessment_methodology OR assessment_leader IS DISTINCT FROM NEW."leaderId" OR assessment_status NOT IN ('approved','published') THEN RAISE EXCEPTION 'Edition membership must match an approved assessment'; END IF;
  IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements(edition_snapshot->'assessments') entry WHERE entry->>'id'=NEW."assessmentId" AND entry->>'leaderId'=NEW."leaderId") THEN RAISE EXCEPTION 'Edition membership is frozen by its snapshot'; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER wallace_membership_frozen BEFORE INSERT ON "WallaceEditionAssessment" FOR EACH ROW EXECUTE FUNCTION wallace_membership_guard();
