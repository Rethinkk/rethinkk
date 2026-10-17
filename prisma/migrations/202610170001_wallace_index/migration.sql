-- CreateTable
CREATE TABLE "WallaceUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roles" TEXT[],
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WallaceUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallaceLeader" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "office" TEXT NOT NULL,
    "officeStart" TEXT NOT NULL,
    "officeEnd" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WallaceLeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallaceMethodology" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "WallaceMethodology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallaceSource" (
    "id" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "predecessorId" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WallaceSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallaceAssessment" (
    "id" TEXT NOT NULL,
    "leaderId" TEXT NOT NULL,
    "methodologyId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "predecessorId" TEXT,
    "correctionReason" TEXT NOT NULL DEFAULT '',
    "periodStart" TEXT NOT NULL,
    "periodEnd" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "authorId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "reviewDecision" TEXT NOT NULL DEFAULT 'pending',
    "reviewNotes" TEXT NOT NULL DEFAULT '',
    "approvedBy" TEXT,
    "reassessOn" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WallaceAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallaceDimensionScore" (
    "assessmentId" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "score" INTEGER,
    "rationale" TEXT NOT NULL,
    "sufficiency" TEXT NOT NULL,
    "reviewerNotes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "WallaceDimensionScore_pkey" PRIMARY KEY ("assessmentId","dimension")
);

-- CreateTable
CREATE TABLE "WallaceEvidence" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "relation" TEXT NOT NULL,

    CONSTRAINT "WallaceEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallaceEdition" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "methodologyId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releaseNotes" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "checksum" TEXT NOT NULL,

    CONSTRAINT "WallaceEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallaceEditionAssessment" (
    "editionId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "leaderId" TEXT NOT NULL,

    CONSTRAINT "WallaceEditionAssessment_pkey" PRIMARY KEY ("editionId","assessmentId")
);

-- CreateTable
CREATE TABLE "WallaceAuditEvent" (
    "id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WallaceAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallaceReview" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WallaceReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallaceContent" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "WallaceContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallaceContribution" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "contact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WallaceContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallaceSourceCheck" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WallaceSourceCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WallaceLeader_slug_key" ON "WallaceLeader"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WallaceMethodology_version_key" ON "WallaceMethodology"("version");

-- CreateIndex
CREATE UNIQUE INDEX "WallaceSource_fingerprint_key" ON "WallaceSource"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "WallaceAssessment_predecessorId_key" ON "WallaceAssessment"("predecessorId");

-- CreateIndex
CREATE UNIQUE INDEX "WallaceAssessment_leaderId_version_key" ON "WallaceAssessment"("leaderId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "WallaceEdition_slug_key" ON "WallaceEdition"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WallaceEditionAssessment_editionId_leaderId_key" ON "WallaceEditionAssessment"("editionId", "leaderId");

-- CreateIndex
CREATE UNIQUE INDEX "WallaceContent_slug_version_key" ON "WallaceContent"("slug", "version");

-- AddForeignKey
ALTER TABLE "WallaceAssessment" ADD CONSTRAINT "WallaceAssessment_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "WallaceLeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallaceAssessment" ADD CONSTRAINT "WallaceAssessment_methodologyId_fkey" FOREIGN KEY ("methodologyId") REFERENCES "WallaceMethodology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallaceAssessment" ADD CONSTRAINT "WallaceAssessment_predecessorId_fkey" FOREIGN KEY ("predecessorId") REFERENCES "WallaceAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallaceDimensionScore" ADD CONSTRAINT "WallaceDimensionScore_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "WallaceAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallaceEvidence" ADD CONSTRAINT "WallaceEvidence_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "WallaceAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallaceEvidence" ADD CONSTRAINT "WallaceEvidence_assessmentId_dimension_fkey" FOREIGN KEY ("assessmentId", "dimension") REFERENCES "WallaceDimensionScore"("assessmentId", "dimension") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallaceEvidence" ADD CONSTRAINT "WallaceEvidence_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "WallaceSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallaceEdition" ADD CONSTRAINT "WallaceEdition_methodologyId_fkey" FOREIGN KEY ("methodologyId") REFERENCES "WallaceMethodology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallaceEditionAssessment" ADD CONSTRAINT "WallaceEditionAssessment_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "WallaceEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallaceEditionAssessment" ADD CONSTRAINT "WallaceEditionAssessment_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "WallaceAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallaceSourceCheck" ADD CONSTRAINT "WallaceSourceCheck_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "WallaceSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
