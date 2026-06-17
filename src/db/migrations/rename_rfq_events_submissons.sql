DO $$
BEGIN
  IF to_regclass('public.rfq_submissions') IS NOT NULL
    AND to_regclass('public.rfq_events_submissons') IS NULL THEN
    ALTER TABLE public.rfq_submissions RENAME TO rfq_events_submissons;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.rfq_events_submissons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_no text NOT NULL UNIQUE,
  company_name text NOT NULL,
  trade_licence_no text,
  contact_person text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  budget_aed text,
  emirate text,
  event_name text NOT NULL,
  event_type text NOT NULL,
  event_date text,
  event_duration text,
  venue_name text,
  venue_location text,
  expected_guests text,
  attachment_files jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rfq_events_submissons
  ADD COLUMN IF NOT EXISTS reference_no text,
  ADD COLUMN IF NOT EXISTS event_name text,
  ADD COLUMN IF NOT EXISTS event_type text,
  ADD COLUMN IF NOT EXISTS event_date text,
  ADD COLUMN IF NOT EXISTS event_duration text,
  ADD COLUMN IF NOT EXISTS venue_name text,
  ADD COLUMN IF NOT EXISTS venue_location text,
  ADD COLUMN IF NOT EXISTS expected_guests text,
  ADD COLUMN IF NOT EXISTS attachment_files jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS notes text;

UPDATE public.rfq_events_submissons
SET
  reference_no = COALESCE(
    reference_no,
    'RFQ-' || to_char(created_at, 'YYYYMMDD') || '-' || upper(substr(replace(id::text, '-', ''), 1, 6))
  ),
  event_name = COALESCE(event_name, 'Legacy RFQ'),
  event_type = COALESCE(event_type, 'Other'),
  attachment_files = COALESCE(attachment_files, '[]'::jsonb);

ALTER TABLE public.rfq_events_submissons
  ALTER COLUMN reference_no SET NOT NULL,
  ALTER COLUMN event_name SET NOT NULL,
  ALTER COLUMN event_type SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS rfq_events_submissons_reference_no_uidx
  ON public.rfq_events_submissons (reference_no);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rfq_events_submissons'
      AND column_name = 'line_items'
  ) THEN
    ALTER TABLE public.rfq_events_submissons
      ALTER COLUMN line_items SET DEFAULT '[]'::jsonb;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rfq_events_submissons'
      AND column_name = 'attachment_urls'
  ) THEN
    ALTER TABLE public.rfq_events_submissons
      ALTER COLUMN attachment_urls SET DEFAULT ARRAY[]::text[];
  END IF;
END $$;
