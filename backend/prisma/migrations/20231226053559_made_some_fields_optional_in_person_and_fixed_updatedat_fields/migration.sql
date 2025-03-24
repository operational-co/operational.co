-- AlterTable
ALTER TABLE `Person` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Project` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Workspace` MODIFY `updatedAt` DATETIME(3) NULL;
