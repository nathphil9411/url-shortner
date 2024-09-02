/*
  Warnings:

  - You are about to drop the column `isUnique` on the `UrlClick` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UrlClick" DROP COLUMN "isUnique",
ADD COLUMN     "is_unique" BOOLEAN NOT NULL DEFAULT false;
