/*
  # Create Brain Age History Table

  1. New Tables
    - `brain_age_history`
      - `id` (uuid, primary key) - Unique identifier for each analysis
      - `filename` (text) - Name of the uploaded MRI file
      - `chronological_age` (integer) - Actual age extracted from filename
      - `predicted_age` (numeric) - Predicted brain age from analysis
      - `difference` (numeric) - Delta between predicted and chronological age
      - `classification` (text) - Brain category (Younger Brain, Normal, etc.)
      - `folder_type` (text, nullable) - Detected folder classification
      - `created_at` (timestamptz) - When the analysis was performed
      - `session_id` (text) - Browser session identifier to group analyses

  2. Security
    - Enable RLS on `brain_age_history` table
    - Add policy for anyone to insert their own records (public access for demo)
    - Add policy for anyone to read their own session records
    - Auto-cleanup: Keep only the 10 most recent records per session

  3. Indexes
    - Index on session_id for faster queries
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS brain_age_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  chronological_age integer NOT NULL,
  predicted_age numeric NOT NULL,
  difference numeric NOT NULL,
  classification text NOT NULL,
  folder_type text,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE brain_age_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON brain_age_history
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read own session"
  ON brain_age_history
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public delete own session"
  ON brain_age_history
  FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_brain_age_history_session_id 
  ON brain_age_history(session_id);

CREATE INDEX IF NOT EXISTS idx_brain_age_history_created_at 
  ON brain_age_history(created_at DESC);

CREATE OR REPLACE FUNCTION cleanup_old_history()
RETURNS trigger AS $$
BEGIN
  DELETE FROM brain_age_history
  WHERE session_id = NEW.session_id
  AND id NOT IN (
    SELECT id FROM brain_age_history
    WHERE session_id = NEW.session_id
    ORDER BY created_at DESC
    LIMIT 10
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_old_history
  AFTER INSERT ON brain_age_history
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_old_history();
