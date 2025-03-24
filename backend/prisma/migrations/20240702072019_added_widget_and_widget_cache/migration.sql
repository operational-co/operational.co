-- CreateTable
CREATE TABLE `Widget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WidgetCache` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `widgetId` INTEGER NULL,
    `data` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WidgetCache` ADD CONSTRAINT `WidgetCache_widgetId_fkey` FOREIGN KEY (`widgetId`) REFERENCES `Widget`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
