/*
# Create user_profiles table

## Summary
Adds a user_profiles table to store supplemental user information including
profession/role selection collected during the signup onboarding flow.

## New Tables
- `user_profiles`
  - `id` (uuid, primary key, references auth.users)
  - `profession` (text) — selected role: junior_dev, senior_dev, student, teacher, designer, product_manager, devops, other
  - `profession_custom` (text, nullable) — free-text field used when profession = 'other'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

## Security
- RLS enabled
- Authenticated users can read, insert, and update their own profile only
- No DELETE policy (profiles should persist for compliance / audit)

## Notes
1. The `id` column is the same UUID as `auth.users.id` — no surrogate key needed.
2. `profession_custom` is optional even when profession is 'other'.
3. `DEFAULT auth.uid()` on `id` lets the client call `.insert({})` without passing the user's ID explicitly.
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  profession text,
  profession_custom text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
