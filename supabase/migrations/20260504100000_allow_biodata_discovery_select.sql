/*
  Allow signed-in members to discover each other's biodatas (matrimonial browsing).

  Existing policies remain:
  - Users can insert/update/delete only their own row.

  This adds SELECT for any authenticated user's biodata rows. Rows are still
  not readable anonymously unless you add a separate policy later.
*/

CREATE POLICY "Authenticated users can read biodatas for discovery"
  ON biodatas FOR SELECT
  TO authenticated
  USING (true);
