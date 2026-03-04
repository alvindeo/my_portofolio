/*
  Warnings:

  - You are about to drop the column `order` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Skill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "order";
