/*
  Warnings:

  - The primary key for the `Shoe` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Shoe" DROP CONSTRAINT "Shoe_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Shoe_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Shoe_id_seq";
