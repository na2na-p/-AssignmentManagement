/*
  Warnings:

  - You are about to drop the column `staffId` on the `subject` table. All the data in the column will be lost.
  - Added the required column `staffName` to the `subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subject" DROP CONSTRAINT "subject_staffId_fkey";

-- AlterTable
ALTER TABLE "subject" DROP COLUMN "staffId",
ADD COLUMN     "staffName" TEXT NOT NULL;
