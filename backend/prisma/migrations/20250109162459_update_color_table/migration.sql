/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Color` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hexValue]` on the table `Color` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Color_name_key` ON `Color`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Color_hexValue_key` ON `Color`(`hexValue`);
