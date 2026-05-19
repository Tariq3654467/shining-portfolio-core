/*
  Verification completion:
  - Only fully verified members appear in biodata discovery (others' search/browse).
  - Users can always read their own biodata and verification row.
  - Authenticated users can read verification status of fully verified members (badges).
*/

DROP POLICY IF EXISTS "Authenticated users can read biodatas for discovery" ON biodatas;

CREATE POLICY "Authenticated users can read verified biodatas for discovery"
  ON biodatas FOR SELECT
  TO authenticated
  USING (
    user_id <> auth.uid()
    AND EXISTS (
      SELECT 1
      FROM verification_records vr
      WHERE vr.user_id = biodatas.user_id
        AND vr.email_verified IS TRUE
        AND vr.phone_verified IS TRUE
    )
  );

CREATE POLICY "Authenticated users can read verified member status"
  ON verification_records FOR SELECT
  TO authenticated
  USING (
    email_verified IS TRUE
    AND phone_verified IS TRUE
  );
