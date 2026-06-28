/*
# Create workflows table for Ancore

1. New Tables
- `workflows`
  - `id` (uuid, primary key) — unique identifier for each workflow
  - `user_id` (uuid, not null) — owner of the workflow, defaults to authenticated user
  - `name` (text, not null) — display name for the workflow
  - `description` (text, nullable) — optional description
  - `nodes` (jsonb, not null) — array of workflow nodes with positions, types, and data
  - `edges` (jsonb, not null) — array of connections between nodes
  - `created_at` (timestamptz) — creation timestamp
  - `updated_at` (timestamptz) — last update timestamp

2. Security
- Enable RLS on `workflows`.
- Owner-scoped CRUD: each authenticated user can only access their own workflows.
*/

CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Untitled Workflow',
  description text,
  nodes jsonb NOT NULL DEFAULT '[]'::jsonb,
  edges jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS workflows_user_id_idx ON workflows(user_id);

ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_workflows" ON workflows;
CREATE POLICY "select_own_workflows" ON workflows FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_workflows" ON workflows;
CREATE POLICY "insert_own_workflows" ON workflows FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_workflows" ON workflows;
CREATE POLICY "update_own_workflows" ON workflows FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_workflows" ON workflows;
CREATE POLICY "delete_own_workflows" ON workflows FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
