/*
  Warnings:

  - You are about to alter the column `category` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- DropIndex
DROP INDEX `Product_category_idx` ON `Product`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `categoryId` INTEGER NULL,
    MODIFY `category` ENUM('food', 'toys', 'accessories', 'healthcare', 'grooming') NOT NULL;
