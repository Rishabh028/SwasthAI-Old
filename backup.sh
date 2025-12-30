#!/bin/bash

# SwasthAI PostgreSQL Backup Script
# This script backs up the PostgreSQL database daily
# Place in project root: ./backup.sh

BACKUP_DIR="/backups"
BACKUP_DATE=$(date +%Y-%m-%d_%H-%M-%S)
DB_NAME=${DB_NAME:-swasthai_db}
DB_USER=${DB_USER:-postgres}
DB_HOST=${DB_HOST:-postgres}
DB_PORT=${DB_PORT:-5432}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Starting backup of $DB_NAME at $(date)"

pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -F custom -b \
    -f "$BACKUP_DIR/backup_${DB_NAME}_${BACKUP_DATE}.dump" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "Backup successful: backup_${DB_NAME}_${BACKUP_DATE}.dump"
    
    # Keep only last 7 days of backups
    find "$BACKUP_DIR" -name "backup_${DB_NAME}_*.dump" -mtime +7 -delete
    
    # Log the backup
    echo "$(date): Backup created successfully" >> "$BACKUP_DIR/backup.log"
else
    echo "Backup failed!"
    echo "$(date): Backup failed" >> "$BACKUP_DIR/backup.log"
    exit 1
fi

# Optional: Upload to S3
# aws s3 cp "$BACKUP_DIR/backup_${DB_NAME}_${BACKUP_DATE}.dump" \
#     s3://your-backup-bucket/swasthai-backups/ \
#     --sse AES256 \
#     --region ap-south-1

echo "Backup completed at $(date)"
