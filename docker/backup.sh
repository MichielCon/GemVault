#!/bin/sh
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/backups
KEEP_DAYS=7

mkdir -p "$BACKUP_DIR"

pg_dump "$DATABASE_URL" | gzip > "$BACKUP_DIR/gemvault_$TIMESTAMP.sql.gz"

# Remove backups older than KEEP_DAYS
find "$BACKUP_DIR" -name "gemvault_*.sql.gz" -mtime +$KEEP_DAYS -delete

echo "Backup complete: gemvault_$TIMESTAMP.sql.gz"
