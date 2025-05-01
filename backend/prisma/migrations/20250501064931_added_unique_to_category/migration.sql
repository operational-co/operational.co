/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,text]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Category_workspaceId_text_key` ON `Category`(`workspaceId`, `text`);
