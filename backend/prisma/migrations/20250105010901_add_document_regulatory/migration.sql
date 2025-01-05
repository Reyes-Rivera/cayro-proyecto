-- CreateTable
CREATE TABLE `DocumentRegulatory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `version` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `effectiveDate` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `isCurrentVersion` BOOLEAN NULL DEFAULT false,
    `previousVersionId` VARCHAR(191) NULL,
    `status` ENUM('CURRENT', 'NOT_CURRENT', 'REMOVED') NULL,
    `type` ENUM('POLICIES', 'TERMS_AND_CONDITIONS', 'LEGAL_DISCLAIMER') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
