-- Backfill project owners from the earliest ADMIN membership.
UPDATE `Workspace` w
SET `adminId` = (
    SELECT wu.`userId`
    FROM `WorkspaceUser` wu
    WHERE wu.`workspaceId` = w.`id`
      AND wu.`role` = 'ADMIN'
    ORDER BY wu.`createdAt` ASC, wu.`id` ASC
    LIMIT 1
)
WHERE w.`adminId` IS NULL;

-- Replace nullable SET NULL relations with deletion cascades.
ALTER TABLE `Coupon` DROP FOREIGN KEY `Coupon_workspaceId_fkey`;
ALTER TABLE `Coupon` ADD CONSTRAINT `Coupon_workspaceId_fkey`
    FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_workspaceId_fkey`;
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_workspaceId_fkey`
    FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Dashboard` DROP FOREIGN KEY `Dashboard_workspaceId_fkey`;
ALTER TABLE `Dashboard` ADD CONSTRAINT `Dashboard_workspaceId_fkey`
    FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;
