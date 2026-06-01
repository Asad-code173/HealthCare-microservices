/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workingHours` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Doctor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "workingDays" TEXT[],
ADD COLUMN     "workingHours" JSONB NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "experience" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_phone_key" ON "Doctor"("phone");
