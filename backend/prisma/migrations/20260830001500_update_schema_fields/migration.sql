-- AlterTable
ALTER TABLE "Event" DROP COLUMN "registrationUrl",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isForceDraft" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "EventProgram" ADD COLUMN     "registrationUrl" TEXT;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "Talent" ADD COLUMN     "tag" TEXT;

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "logoUrl" TEXT,
    "heroImageUrl" TEXT,
    "siteTitle" TEXT,
    "siteDescription" TEXT,
    "footerDescription" TEXT,
    "footerCopyright" TEXT,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
