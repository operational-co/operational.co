-- CreateTable
CREATE TABLE `Widget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dashboardId` INTEGER NOT NULL,
    `type` ENUM('LINE', 'BAR', 'STATS') NOT NULL,
    `groupBy` ENUM('CATEGORY', 'NAME') NULL,
    `selectors` JSON NULL,

    INDEX `Widget_dashboardId_idx`(`dashboardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Widget` ADD CONSTRAINT `Widget_dashboardId_fkey` FOREIGN KEY (`dashboardId`) REFERENCES `Dashboard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
