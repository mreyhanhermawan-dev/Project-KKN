-- Migration 0012: Add email column to admin_user table
-- Used for password reset via email feature
ALTER TABLE admin_user ADD COLUMN email TEXT;
