# Catertech — Technical Document

## Stack
| Layer | Tool | Notes |
|-------|------|-------|
| Frontend | Next.js 16 App Router | SSR + SSG |
| Styling | Tailwind CSS | Mobile-first |
| Database | Neon.tech (PostgreSQL) | Free tier, never pauses |
| ORM | Drizzle ORM | Type-safe, works with Neon |
| Auth | NextAuth.js v5 | Credentials + OTP |
| Image Storage | Cloudflare R2 | S3-compatible, zero egress |
| Email | Resend | OTP + RFQ + enquiry emails |
| Hosting | Hetzner VPS + Coolify | ~$3.50/mo |
| CDN | Cloudflare Free | In front of Hetzner |
| i18n | next-intl | EN + AR (RTL) |

---

## Environment Variables
```env
# Database
DATABASE_URL=postgresql://...neon.tech/catertech

# Auth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://catertech.ae

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY=
R2_SECRET_KEY=
R2_BUCKET_NAME=catertech-images
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# Resend Email
RESEND_API_KEY=
RESEND_FROM=noreply@catertech.ae

# Google
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# App
NEXT_PUBLIC_SITE_URL=https://catertech.ae
NEXT_PUBLIC_WHATSAPP_NUMBER=971XXXXXXXXX
```

---

## Database Schema

```sql
-- USERS & AUTH
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password      TEXT NOT NULL,
  role          TEXT DEFAULT 'user', -- 'user' | 'corporate' | 'admin'
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE profiles (
  id            SERIAL PRIMARY KEY,
  user_id       INT REFERENCES users(id) ON DELETE CASCADE,
  full_name     TEXT,
  company       TEXT,
  phone         TEXT,
  emirate       TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE otp_verifications (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL,
  otp           TEXT NOT NULL,
  type          TEXT NOT NULL, -- 'signup' | 'login'
  verified      BOOLEAN DEFAULT FALSE,
  attempts      INT DEFAULT 0,
  expires_at    TIMESTAMP NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE categories (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  parent_id     INT REFERENCES categories(id),
  image_url     TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  price         DECIMAL(10,2),
  stock         INT DEFAULT 0,
  category_id   INT REFERENCES categories(id),
  images        TEXT[],       -- array of R2 URLs
  specs         JSONB,        -- flexible key/value specs
  is_featured   BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- CART & ORDERS
CREATE TABLE carts (
  id            SERIAL PRIMARY KEY,
  user_id       INT REFERENCES users(id) ON DELETE CASCADE,
  session_id    TEXT,         -- for guest carts
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cart_items (
  id            SERIAL PRIMARY KEY,
  cart_id       INT REFERENCES carts(id) ON DELETE CASCADE,
  product_id    INT REFERENCES products(id),
  quantity      INT DEFAULT 1,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- RFQ & ENQUIRIES
CREATE TABLE rfq_submissions (
  id              SERIAL PRIMARY KEY,
  reference_no    TEXT UNIQUE NOT NULL, -- e.g. RFQ-2025-0001
  company_name    TEXT NOT NULL,
  trade_licence   TEXT,
  contact_person  TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT NOT NULL,
  emirate         TEXT,
  required_date   DATE,
  budget_range    TEXT,
  line_items      JSONB NOT NULL, -- [{name, qty, unit, notes}]
  file_url        TEXT,           -- R2 URL of uploaded file
  status          TEXT DEFAULT 'new', -- 'new'|'viewed'|'responded'
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE enquiry_submissions (
  id              SERIAL PRIMARY KEY,
  company_name    TEXT NOT NULL,
  contact_person  TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT NOT NULL,
  emirate         TEXT,
  service_interest TEXT,
  message         TEXT,
  file_url        TEXT,
  status          TEXT DEFAULT 'new',
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE checkout_rfq (
  id              SERIAL PRIMARY KEY,
  reference_no    TEXT UNIQUE NOT NULL,
  user_id         INT REFERENCES users(id),
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  address         TEXT,
  emirate         TEXT,
  delivery_option TEXT,
  cart_items      JSONB NOT NULL, -- snapshot of cart at submit
  status          TEXT DEFAULT 'new',
  created_at      TIMESTAMP DEFAULT NOW()
);


-- EVENT MANAGEMENT

CREATE TABLE events (
  id                SERIAL PRIMARY KEY,
  client_user_id    INT REFERENCES users(id),
  event_name        TEXT NOT NULL,
  event_date        DATE NOT NULL,
  venue             TEXT,
  emirate           TEXT,
  expected_guests   INT,
  services          TEXT[],  -- ['photography','videography','checkin','badges','report']
  status            TEXT DEFAULT 'enquiry', -- 'enquiry'|'confirmed'|'in-progress'|'completed'
  created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE event_guests (
  id                SERIAL PRIMARY KEY,
  event_id          INT REFERENCES events(id) ON DELETE CASCADE,
  full_name         TEXT NOT NULL,
  email             TEXT,
  phone             TEXT,
  company           TEXT,
  qr_code           TEXT UNIQUE NOT NULL,  -- unique token per guest
  badge_url         TEXT,                  -- R2 URL of generated badge PDF
  checked_in        BOOLEAN DEFAULT FALSE,
  checked_in_at     TIMESTAMP,
  checked_out       BOOLEAN DEFAULT FALSE,
  checked_out_at    TIMESTAMP,
  created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE event_enquiries (
  id                SERIAL PRIMARY KEY,
  company_name      TEXT NOT NULL,
  contact_person    TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT NOT NULL,
  emirate           TEXT,
  event_date        DATE,
  expected_guests   INT,
  services_needed   TEXT[],  -- selected services
  message           TEXT,
  status            TEXT DEFAULT 'new',
  created_at        TIMESTAMP DEFAULT NOW()
);


-- BLOG
CREATE TABLE blog_posts (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT,          -- HTML or markdown
  featured_image  TEXT,          -- R2 URL
  category        TEXT,          -- Hotel|Corporate|Wedding|Government|F&B
  tags            TEXT[],
  instagram_url   TEXT,
  is_published    BOOLEAN DEFAULT FALSE,
  published_at    TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- SITE CONTENT
CREATE TABLE testimonials (
  id              SERIAL PRIMARY KEY,
  quote           TEXT NOT NULL,
  client_name     TEXT NOT NULL,
  company         TEXT,
  rating          INT DEFAULT 5,
  is_active       BOOLEAN DEFAULT TRUE
);

CREATE TABLE client_logos (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  logo_url        TEXT NOT NULL, -- R2 URL
  order_index     INT DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE
);
```

---

## API Routes

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /api/auth/signup | Register new user | Public |
| POST | /api/auth/send-otp | Send OTP email | Public |
| POST | /api/auth/verify-otp | Verify OTP | Public |
| GET | /api/products | List products, filters | Public |
| GET | /api/products/[slug] | Single product | Public |
| POST | /api/products | Create product | Admin |
| PUT | /api/products/[id] | Update product | Admin |
| DELETE | /api/products/[id] | Delete product | Admin |
| POST | /api/upload | Upload image to R2 | Admin |
| GET | /api/cart | Get user cart | User |
| POST | /api/cart | Add item to cart | User |
| PUT | /api/cart/[id] | Update qty | User |
| DELETE | /api/cart/[id] | Remove item | User |
| POST | /api/rfq | Submit RFQ form | Public |
| POST | /api/enquiry | Submit enquiry form | Public |
| POST | /api/checkout | Submit cart as RFQ | User |
| GET | /api/blog | List blog posts | Public |
| POST | /api/event-enquiry | Submit event management enquiry | Public |
| POST | /api/admin/events | Create new event | Admin |
| GET | /api/admin/events | List all events | Admin |
| POST | /api/admin/events/[id]/guests | Upload guest list CSV | Admin |
| GET | /api/admin/events/[id]/guests | Get all guests for event | Admin |
| POST | /api/admin/events/[id]/badges | Generate badges PDF for all guests | Admin |
| GET | /api/admin/events/[id]/checkin | Live check-in dashboard data | Admin |
| POST | /api/checkin/scan | Scan QR → mark guest checked-in | Admin/Staff |
| GET | /api/admin/events/[id]/report | Generate post-event PDF report | Admin |
| GET | /api/blog/[slug] | Single post | Public |
| POST | /api/blog | Create post | Admin |
| PUT | /api/blog/[id] | Update post | Admin |
| DELETE | /api/blog/[id] | Delete post | Admin |
| GET | /api/admin/rfq | All RFQs | Admin |
| PUT | /api/admin/rfq/[id] | Update RFQ status | Admin |
| GET | /api/admin/users | All users | Admin |
| PUT | /api/admin/users/[id] | Update user role | Admin |

---

## Auth Flow Summary
1. Signup → hash password → save to users table → send OTP → verify OTP → is_verified = true
2. Login → check email/password → send OTP → verify OTP → NextAuth creates session with {id, email, role}
3. Session includes role. Middleware checks role for /admin/* and /trade/* routes.
4. Admin user created manually via seed script. Client never self-registers as admin.

---

## Image Upload Flow (R2)
1. Admin selects image in admin panel form
2. POST /api/upload → server reads file → PutObjectCommand to R2 bucket
3. R2 returns → construct public URL: R2_PUBLIC_URL/filename
4. URL saved to products.images[] or blog_posts.featured_image in Neon
5. Frontend displays via Next.js <Image> component (handles resize + WebP)

---

## RFQ Reference Number Format
RFQ-{YEAR}-{4-digit sequence} → e.g. RFQ-2025-0001
Generated on submit, stored in rfq_submissions.reference_no

