-- CreateTable
CREATE TABLE `Push` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pushSubscription` JSON NULL,
    `userId` INTEGER NOT NULL,
    `sid` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Push` ADD CONSTRAINT `Push_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
