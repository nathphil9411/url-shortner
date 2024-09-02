-- DropForeignKey
ALTER TABLE "UrlClick" DROP CONSTRAINT "UrlClick_url_id_fkey";

-- AddForeignKey
ALTER TABLE "UrlClick" ADD CONSTRAINT "UrlClick_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "Url"("id") ON DELETE CASCADE ON UPDATE CASCADE;
