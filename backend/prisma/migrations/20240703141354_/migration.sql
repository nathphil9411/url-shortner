/*
  Warnings:

  - The `qr_code` column on the `Url` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Url" DROP COLUMN "qr_code",
ADD COLUMN     "qr_code" JSONB;
