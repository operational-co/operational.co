/*
  Warnings:

  - You are about to drop the column `notify` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pushSubscription` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `notify`,
    DROP COLUMN `pushSubscription`;

-- AlterTable
ALTER TABLE `WorkspaceUser` ADD COLUMN `notify` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `pushSubscription` JSON NULL;
