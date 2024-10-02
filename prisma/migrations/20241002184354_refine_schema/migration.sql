/*
  Warnings:

  - You are about to alter the column `status` on the `Adoption` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `status` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `healthStatus` on the `Pet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[user1Id,user2Id]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `otpAttempts` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_userId_fkey`;

-- AlterTable
ALTER TABLE `Adoption` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `isRead` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('PENDING', 'SHIPPED', 'DELIVERED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `Pet` MODIFY `healthStatus` ENUM('HEALTHY', 'SICK', 'RECOVERING') NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    MODIFY `otpAttempts` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `Conversation_user1Id_user2Id_key` ON `Conversation`(`user1Id`, `user2Id`);

-- CreateIndex
CREATE INDEX `Pet_breed_idx` ON `Pet`(`breed`);

-- CreateIndex
CREATE INDEX `Product_category_idx` ON `Product`(`category`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- RenameIndex
ALTER TABLE `Adoption` RENAME INDEX `Adoption_adopterId_fkey` TO `Adoption_adopterId_idx`;

-- RenameIndex
ALTER TABLE `Adoption` RENAME INDEX `Adoption_petId_fkey` TO `Adoption_petId_idx`;

-- RenameIndex
ALTER TABLE `Message` RENAME INDEX `Message_conversationId_fkey` TO `Message_conversationId_idx`;

-- RenameIndex
ALTER TABLE `Message` RENAME INDEX `Message_receiverId_fkey` TO `Message_receiverId_idx`;

-- RenameIndex
ALTER TABLE `Message` RENAME INDEX `Message_senderId_fkey` TO `Message_senderId_idx`;

-- RenameIndex
ALTER TABLE `Order` RENAME INDEX `Order_productId_fkey` TO `Order_productId_idx`;

-- RenameIndex
ALTER TABLE `Order` RENAME INDEX `Order_userId_fkey` TO `Order_userId_idx`;
