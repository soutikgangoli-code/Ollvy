-- Add missing file columns to chat_messages
-- These are required for file attachments to work

ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS file_path TEXT;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS file_size INTEGER;
