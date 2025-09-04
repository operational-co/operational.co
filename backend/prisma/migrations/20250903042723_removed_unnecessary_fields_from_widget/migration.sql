/*
  Warnings:

  - You are about to drop the column `groupBy` on the `Widget` table. All the data in the column will be lost.
  - You are about to drop the column `selectors` on the `Widget` table. All the data in the column will be lost.
  - The values [BAR] on the enum `Widget_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Widget` DROP COLUMN `groupBy`,
    DROP COLUMN `selectors`,
    MODIFY `type` ENUM('LINE', 'STAT') NOT NULL;
