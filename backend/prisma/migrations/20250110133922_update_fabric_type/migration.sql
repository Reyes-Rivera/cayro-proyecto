/*
  Warnings:

  - Added the required column `mission` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vision` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `FabricType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `companyprofile` ADD COLUMN `mission` VARCHAR(191) NOT NULL,
    ADD COLUMN `vision` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `fabrictype` ADD COLUMN `description` VARCHAR(191) NOT NULL;
