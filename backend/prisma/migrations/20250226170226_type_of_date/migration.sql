/*
  Warnings:

  - You are about to drop the column `birthday` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `birthday` on the `user` table. All the data in the column will be lost.
  - Added the required column `birthdate` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthdate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` DROP COLUMN `birthday`,
    ADD COLUMN `birthdate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `birthday`,
    ADD COLUMN `birthdate` DATETIME(3) NOT NULL;
