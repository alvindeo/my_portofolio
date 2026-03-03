-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "challenges" TEXT,
ADD COLUMN     "fullDescription" TEXT,
ADD COLUMN     "highlights" TEXT[],
ADD COLUMN     "outcome" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "techIcons" TEXT[],
ADD COLUMN     "year" TEXT;
