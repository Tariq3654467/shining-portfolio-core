/*
  # Storage bucket for profile pictures (ProfilePictureUpload.tsx)

  Creates public bucket `biodata-images` and RLS policies so:
  - Anyone can read objects (public URLs via getPublicUrl)
  - Authenticated users can upload/update/delete under profile-pictures/
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'biodata-images',
  'biodata-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "biodata_images_public_read" ON storage.objects;
CREATE POLICY "biodata_images_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'biodata-images');

DROP POLICY IF EXISTS "biodata_images_authenticated_insert" ON storage.objects;
CREATE POLICY "biodata_images_authenticated_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'biodata-images'
  AND name LIKE 'profile-pictures/' || auth.uid()::text || '-%'
);

DROP POLICY IF EXISTS "biodata_images_authenticated_update" ON storage.objects;
CREATE POLICY "biodata_images_authenticated_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'biodata-images'
  AND name LIKE 'profile-pictures/' || auth.uid()::text || '-%'
);

DROP POLICY IF EXISTS "biodata_images_authenticated_delete" ON storage.objects;
CREATE POLICY "biodata_images_authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'biodata-images'
  AND name LIKE 'profile-pictures/' || auth.uid()::text || '-%'
);
