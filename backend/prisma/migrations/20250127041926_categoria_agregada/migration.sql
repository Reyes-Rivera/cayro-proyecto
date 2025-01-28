/*
  Warnings:

  - You are about to drop the column `departmentId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `embroideryThreadId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `sewingThreadId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `embroiderythread` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sewingthread` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_departmentId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_embroideryThreadId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_sewingThreadId_fkey`;

-- DropIndex
DROP INDEX `Product_departmentId_fkey` ON `product`;

-- DropIndex
DROP INDEX `Product_embroideryThreadId_fkey` ON `product`;

-- DropIndex
DROP INDEX `Product_sewingThreadId_fkey` ON `product`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `departmentId`,
    DROP COLUMN `embroideryThreadId`,
    DROP COLUMN `sewingThreadId`,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `department`;

-- DropTable
DROP TABLE `embroiderythread`;

-- DropTable
DROP TABLE `sewingthread`;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
