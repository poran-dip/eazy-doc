-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "appointmentHistory" TEXT[],
ADD COLUMN     "comments" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "prescriptions" TEXT[],
ADD COLUMN     "tests" TEXT[];
