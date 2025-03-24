/*
  Warnings:

  - You are about to drop the column `appointmentHistory` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "appointmentHistory";

-- CreateTable
CREATE TABLE "_RelatedAppointments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RelatedAppointments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RelatedAppointments_B_index" ON "_RelatedAppointments"("B");

-- AddForeignKey
ALTER TABLE "_RelatedAppointments" ADD CONSTRAINT "_RelatedAppointments_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedAppointments" ADD CONSTRAINT "_RelatedAppointments_B_fkey" FOREIGN KEY ("B") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
