/*
  # Add profile picture support to biodatas table

  1. Modified Tables
    - `biodatas`: Add profile_picture_url column to store uploaded image path

  2. Security
    - Uses existing RLS policies on biodatas table
    - Images stored in Supabase Storage with row-level security
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'biodatas' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE biodatas ADD COLUMN profile_picture_url text;
  END IF;
END $$;
