-- CreateIndex
CREATE INDEX `Event_workspaceId_contextType_test_createdAt_idx` ON `Event`(`workspaceId`, `contextType`, `test`, `createdAt`);

-- CreateIndex
CREATE INDEX `Event_workspaceId_contextType_test_category_createdAt_idx` ON `Event`(`workspaceId`, `contextType`, `test`, `category`, `createdAt`);

-- CreateIndex
CREATE INDEX `Event_workspaceId_contextType_contextId_idx` ON `Event`(`workspaceId`, `contextType`, `contextId`);
