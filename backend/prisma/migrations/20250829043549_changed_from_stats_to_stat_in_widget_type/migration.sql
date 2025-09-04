/*
  Warnings:

  - The values [STATS] on the enum `Widget_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Widget` MODIFY `type` ENUM('LINE', 'BAR', 'STAT') NOT NULL;
