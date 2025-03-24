/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Widget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WidgetCache` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Widget` DROP FOREIGN KEY `Widget_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `WidgetCache` DROP FOREIGN KEY `WidgetCache_widgetId_fkey`;

-- DropTable
DROP TABLE `Event`;

-- DropTable
DROP TABLE `User2`;

-- DropTable
DROP TABLE `Widget`;

-- DropTable
DROP TABLE `WidgetCache`;
