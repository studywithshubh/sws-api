/*
  Warnings:

  - You are about to drop the column `commentsCount` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `notionMetadataId` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "commentsCount",
DROP COLUMN "notionMetadataId",
DROP COLUMN "thumbnail",
ADD COLUMN     "notesUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT;
