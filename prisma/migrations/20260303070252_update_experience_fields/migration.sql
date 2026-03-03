/*
  Warnings:

  - You are about to drop the column `current` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Experience` table. All the data in the column will be lost.
  - Added the required column `achievements` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Experience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "current",
DROP COLUMN "endDate",
DROP COLUMN "position",
DROP COLUMN "startDate",
ADD COLUMN     "achievements" TEXT NOT NULL,
ADD COLUMN     "period" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT NOT NULL;
