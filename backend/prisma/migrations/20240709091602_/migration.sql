-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Url" DROP CONSTRAINT "Url_owner_id_fkey";

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
