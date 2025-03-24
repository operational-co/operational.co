
-- first pass --
CREATE TABLE IF NOT EXISTS Events (
    id UUID,
    workspaceId UInt32, -- required --
    userId String,
    name String, -- required --
    actions Array(String),
    avatar String,
    content String,
    type Enum8('text' = 0, 'rows' = 1, 'json' = 2) DEFAULT 'text',
    muted Bool DEFAULT 0,
    test Bool DEFAULT 0,
    notify Bool DEFAULT 0,
    searchable String,
    contextId String,
    contextType Int8 DEFAULT 0,
    createdAt DateTime64(3, 'UTC'),
    errors String,
    category String,
    version UInt32 DEFAULT 0
) ENGINE = ReplacingMergeTree(version)
PARTITION BY (workspaceId, toYYYYMM(createdAt))
ORDER BY (workspaceId, createdAt, id);
