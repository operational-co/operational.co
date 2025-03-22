ALTER TABLE Events
ADD INDEX searchable_bloom_index (searchable) TYPE ngrambf_v1(4, 1024, 1, 0) GRANULARITY 1;
