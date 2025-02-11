/*
  Warnings:

  - You are about to drop the column `barcode` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `saledetail` table. All the data in the column will be lost.
  - You are about to drop the `material` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productcolor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productmaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productsize` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productVariantId` to the `SaleDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `productcolor` DROP FOREIGN KEY `ProductColor_colorId_fkey`;

-- DropForeignKey
ALTER TABLE `productcolor` DROP FOREIGN KEY `ProductColor_productId_fkey`;

-- DropForeignKey
ALTER TABLE `productmaterial` DROP FOREIGN KEY `ProductMaterial_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `productmaterial` DROP FOREIGN KEY `ProductMaterial_productId_fkey`;

-- DropForeignKey
ALTER TABLE `productsize` DROP FOREIGN KEY `ProductSize_productId_fkey`;

-- DropForeignKey
ALTER TABLE `productsize` DROP FOREIGN KEY `ProductSize_sizeId_fkey`;

-- DropForeignKey
ALTER TABLE `saledetail` DROP FOREIGN KEY `SaleDetail_productId_fkey`;

-- DropIndex
DROP INDEX `Product_barcode_key` ON `product`;

-- DropIndex
DROP INDEX `SaleDetail_productId_fkey` ON `saledetail`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `barcode`,
    DROP COLUMN `salePrice`,
    DROP COLUMN `stock`;

-- AlterTable
ALTER TABLE `saledetail` DROP COLUMN `productId`,
    ADD COLUMN `productVariantId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `material`;

-- DropTable
DROP TABLE `productcolor`;

-- DropTable
DROP TABLE `productmaterial`;

-- DropTable
DROP TABLE `productsize`;

-- CreateTable
CREATE TABLE `ProductVariant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `colorId` INTEGER NOT NULL,
    `sizeId` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `barcode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProductVariant_barcode_key`(`barcode`),
    UNIQUE INDEX `ProductVariant_productId_colorId_sizeId_key`(`productId`, `colorId`, `sizeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductVariant` ADD CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductVariant` ADD CONSTRAINT `ProductVariant_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `Color`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductVariant` ADD CONSTRAINT `ProductVariant_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `Size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleDetail` ADD CONSTRAINT `SaleDetail_productVariantId_fkey` FOREIGN KEY (`productVariantId`) REFERENCES `ProductVariant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
