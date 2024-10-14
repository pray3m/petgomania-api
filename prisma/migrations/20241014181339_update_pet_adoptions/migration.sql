/*
  Warnings:

  - A unique constraint covering the columns `[petId,adopterId]` on the table `Adoption` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Adoption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Adoption` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Pet` ADD COLUMN `gender` ENUM('MALE', 'FEMALE', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN';

-- CreateIndex
CREATE UNIQUE INDEX `Adoption_petId_adopterId_key` ON `Adoption`(`petId`, `adopterId`);
