-- AlterTable
ALTER TABLE `User` ADD COLUMN `activated` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Workspace` ADD COLUMN `onboardStep` VARCHAR(191) NOT NULL DEFAULT 'intro',
    ADD COLUMN `onboarded` BOOLEAN NOT NULL DEFAULT false;
