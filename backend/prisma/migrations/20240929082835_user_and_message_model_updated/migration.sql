/*
  Warnings:

  - Added the required column `sendTo` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "sendTo" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sendTo_fkey" FOREIGN KEY ("sendTo") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
