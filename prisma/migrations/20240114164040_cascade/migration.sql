-- DropForeignKey
ALTER TABLE "Shoe" DROP CONSTRAINT "Shoe_invoiceId_fkey";

-- AddForeignKey
ALTER TABLE "Shoe" ADD CONSTRAINT "Shoe_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
