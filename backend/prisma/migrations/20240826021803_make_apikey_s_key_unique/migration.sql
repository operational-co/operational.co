/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Apikey` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Apikey_key_key` ON `Apikey`(`key`);
