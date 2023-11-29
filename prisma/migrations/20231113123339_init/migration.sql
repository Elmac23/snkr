-- CreateEnum
CREATE TYPE "currency" AS ENUM ('PLN', 'EUR');

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "currency" "currency" NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "housingNumber" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shoe" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "invoiceId" TEXT,

    CONSTRAINT "Shoe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shoe" ADD CONSTRAINT "Shoe_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
