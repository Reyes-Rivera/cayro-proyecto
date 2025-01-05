/*
  Warnings:

  - You are about to alter the column `previousVersionId` on the `documentregulatory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `documentregulatory` MODIFY `previousVersionId` INTEGER NULL;
