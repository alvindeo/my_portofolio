/*
  Warnings:

  - You are about to drop the column `endDate` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Education` table. All the data in the column will be lost.
  - Added the required column `description` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "About" ADD COLUMN     "bio2" TEXT,
ADD COLUMN     "bio3" TEXT,
ADD COLUMN     "bio4" TEXT,
ADD COLUMN     "cvUrl" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "title" TEXT,
ALTER COLUMN "bio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "period" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "imageUrl" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);
