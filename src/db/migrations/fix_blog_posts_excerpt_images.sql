-- Align `blog_posts` with Drizzle when the table predates excerpt / gallery columns.
-- Apply in Neon SQL Editor, or run: npm run db:push

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT;

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'::TEXT[];
UPDATE blog_posts SET images = '{}'::TEXT[] WHERE images IS NULL;
ALTER TABLE blog_posts ALTER COLUMN images SET DEFAULT '{}'::TEXT[];
ALTER TABLE blog_posts ALTER COLUMN images SET NOT NULL;
