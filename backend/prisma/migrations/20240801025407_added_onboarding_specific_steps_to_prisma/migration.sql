-- AlterTable
ALTER TABLE `User` ADD COLUMN `onboarded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `onboardingStep` VARCHAR(191) NULL;
