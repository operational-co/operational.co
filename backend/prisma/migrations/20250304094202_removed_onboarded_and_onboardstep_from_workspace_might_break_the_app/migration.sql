/*
  Warnings:

  - You are about to drop the column `onboardStep` on the `Workspace` table. All the data in the column will be lost.
  - You are about to drop the column `onboarded` on the `Workspace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Workspace` DROP COLUMN `onboardStep`,
    DROP COLUMN `onboarded`;
