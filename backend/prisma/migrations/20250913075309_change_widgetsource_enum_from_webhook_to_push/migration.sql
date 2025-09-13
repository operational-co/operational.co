/*
  Warnings:

  - The values [WEBHOOK] on the enum `Widget_source` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Widget` MODIFY `source` ENUM('EVENTS', 'PUSH') NOT NULL DEFAULT 'EVENTS';
