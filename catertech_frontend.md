# Catertech — Frontend Document

## Rules For Every Page
- Mobile-first. Build mobile layout first, then md: lg: breakpoints
- All text via i18n — never hardcode strings in components
- RTL: when locale = ar, html dir="rtl", mirror layouts, flip icons
- Images: always use Next.js <Image> with R2 URL as src
- No page reload for filters — use React state or URL params
- WhatsApp float button on every page (bottom right)
- All animations: scroll-triggered, use framer-motion or CSS intersection observer
- Loading states on all data-fetch components

---

## Global Components

### Header
- Logo left, nav center, CTA + language toggle + cart icon right
- Sticky on scroll with background blur
- Mobile: hamburger menu, full-screen slide-in nav
- Language toggle: EN | AR — switches locale, persists in cookie
- Cart icon shows item count badge

### Footer
- 4 columns: Company Info | Navigation | Services | Contact & Social
- Column 1: logo, tagline, UAE trade licence
- Column 2: site nav links
- Column 3: services links
- Column 4: phone, email, WhatsApp, social icons
- Bottom bar: copyright, privacy, terms
- Newsletter strip above columns: email input + subscribe button

### WhatsApp Float Button
- Fixed bottom-right on all pages
- Opens wa.me/{NEXT_PUBLIC_WHATSAPP_NUMBER}
- Pre-filled message: "Hello Catertech, I'd like to enquire about your services"

---

## Page Components

### Home (/)

#### Hero Section
- Full viewport height
- Background: autoplay muted loop video, fallback to parallax image on mobile
- Dark gradient overlay
- Animated headline: typewriter or word fade-in with framer-motion
- Subheadline: static text
- 2 CTA buttons side by side: gold filled + white outlined
- Scroll-down arrow: bounce animation

#### Trust Bar
- Full width, dark navy/charcoal background
- 4 stats with CountUp animation on scroll into view
- Stats: "20+ Years in UAE" | "1,000+ Events Served" | "500+ Corporate Clients" | "Dubai & RAK Coverage"
- Gold numbers, white labels

#### Services Cards (3 grid)
- Equal width, full-bleed background image per card
- Hover: image zoom, overlay darken, slide-up "Explore →" button
- Links to /services/catering-equipment, /services/event-rental, /services/kitchen-equipment

#### Featured Products
- Heading: "Shop Our Range" + "View All →"
- Filter tabs: All | Catering | Events | Kitchen (no page reload)
- 6-8 product cards: image, name, price, Add to Cart / View Details
- Desktop: 3 col grid. Tablet: 2 col. Mobile: horizontal scroll + snap

#### Trade & Corporate CTA Block
- Alternating layout: text left, image right
- 2 CTAs: "Submit an Enquiry" + "Request a Full Quote"
- Subtle diagonal background texture

#### Company Journey Teaser
- 4-5 milestones horizontal strip
- Scroll-triggered connecting line draw animation
- Mobile: vertical stacked
- "See Our Full Story →" link

#### Client Logo Strip
- Auto-scrolling marquee (CSS animation, infinite loop)
- Logos: grayscale default, color on hover
- 8-12 logos, to be supplied by client

#### Testimonials
- 3 cards: quote, name, company, star rating
- Auto-rotate every 5 seconds
- Manual dot navigation
- Light grey/cream background section

#### Deseri Partner Block
- Clean bordered card
- Logo, 2-3 line description
- "Visit Deseri Website →" external link button
- Placed above footer, after testimonials

#### Blog Preview Strip
- 3 latest posts: image, title, date, category tag, excerpt, Read More
- "View All Stories →" link

---

### Company Journey (/about/journey)
- Full-screen sections per milestone (use 100vh per section)
- Large year display text (e.g. 10xl font, semi-transparent)
- Title + description text
- Image: right side desktop, full-bleed mobile
- Alternating left/right layout per milestone
- Scroll-triggered reveal: slide-in from side + fade
- Optional parallax background per era
- 12 milestones: 2005 → 2025

---

### Browse & Rent (/shop)
- Sidebar filters: category, price range, brand (desktop)
- Mobile: filter drawer (slide from bottom)
- Product grid: 3 col desktop, 2 col tablet, 1 col mobile
- Each card: image, name, price, Add to Cart button
- Search bar at top
- Pagination or infinite scroll

### Product Page (/shop/[product])
- Image gallery: main image + thumbnail strip
- Product name, stock status
- Description tab + Specifications tab
- Add to Cart button (primary)
- WhatsApp enquiry button: pre-filled with product name
- Related products strip at bottom

### Cart (/cart)
- Line items: image, name, qty stepper, remove, line total
- Order summary: subtotal, note about RFQ process
- "Proceed to Checkout" CTA

### Checkout (/checkout)
- Form: Full Name, Email, Phone, Address, Emirate, Delivery Option
- Order summary sidebar
- Submit → RFQ confirmation screen with reference number

---

### Trade Portal (/trade)
- 2 large cards: Quick Enquiry + Request a Quote
- Industry badges below

### Simple Enquiry (/trade/enquiry)
- Fields: Company, Contact, Phone, Email, Emirate, Service Interest, Message, File Upload
- Submit → confirmation screen with WhatsApp follow-up link

### RFQ (/trade/rfq)
- Fields: Company, Trade Licence, Contact, Phone, Email, Emirate, Date, Budget
- Dynamic line-item table: add/remove rows, each row has Item, Qty, Unit, Notes
- File Upload
- Submit → unique reference number shown, emails sent

—


### Event Management Landing (/event-management)
- Hero: full-width event photo, heading + subheading overlay
- 5 service cards in grid: Photography, Videography, Event Report, Check-in, Badge & QR
- Each card: icon, title, description, Enquire Now button
- Target audience section: badge grid (Corporate | Wedding | Government | Hotel | Private)
- CTA block: equipment rental + event services bundle pitch
- Enquiry form: Company, Contact, Phone, Email, Emirate, Event Date, 
  Expected Guests, Services Needed (multi-select checkboxes), Message

### Photography & Videography (/event-management/media)
- Package cards: Basic / Standard / Premium with inclusions list
- Sample gallery grid (lightbox on click)
- Book Now CTA → enquiry form with service pre-filled

### Event Check-in (/event-management/checkin)
- How it works: 3-step visual (Upload List → Print Badges → Scan Entry)
- Two mode cards: Staff-managed vs Self-serve kiosk
- Feature list with icons
- CTA: Add to Event

### Badge & QR Generator (/event-management/badges)
- Process steps: 4-step visual flow
- Badge template previews (mockup images)
- CTA: Get Badges for Your Event

### Admin — Events Manager (/admin/events)
- Events list table: name, date, venue, guest count, status, actions
- Create Event button → modal form
- Event detail page:
  - Guest list tab: table of guests, upload CSV button, generate badges button
  - Check-in tab: live counter (X / Y checked in), guest list with checked-in status, 
    QR scan button (opens camera on mobile)
  - Report tab: generate PDF report button, download link when ready

### Staff Check-in Scanner (/admin/events/[id]/scan)
- Mobile-optimised full screen
- Camera QR scanner (use react-qr-reader or html5-qrcode)
- On scan: POST to /api/checkin/scan with QR token
- Success: show guest name + green checkmark
- Already checked in: show warning
- Unknown QR: show error


### Blog (/blog)
- Category filter tabs: All | Hotel | Corporate | Wedding | Government | F&B
- Card grid: full-bleed photo, title, category, date, excerpt, Read Full Story
- Pagination

### Blog Post (/blog/[slug])
- Hero image full width
- Title, date, category tag
- Body content
- Instagram embed (optional, if URL provided)
- Share buttons: Instagram, Facebook, LinkedIn, WhatsApp
- Hashtags section
- You may also like: 2-3 related posts

---

### Admin Panel (/admin)
- Sidebar nav: Dashboard | Products | RFQ | Enquiries | Blog | Users | Settings
- Protected: role = admin only
- Dashboard: stat cards (total products, RFQs today, enquiries, blog posts)
- All data tables: sortable, searchable, paginated
- Product form: name, slug, description, price, stock, category, image upload (multi), specs (key/value pairs), featured toggle
- RFQ table: reference no, company, date, status badge, view button
- Blog form: title, slug, content (rich text), featured image upload, category, tags, publish toggle

---

## Animation Guidelines
| Element | Animation | Trigger |
|---------|-----------|---------|
| Hero headline | Typewriter or word fade-in | Page load |
| Trust bar stats | CountUp number animation | Scroll into view |
| Service cards | Hover zoom + overlay slide-up | Hover |
| Journey timeline | Slide in from side + fade | Scroll into view |
| Journey line | Draw/grow connecting line | Scroll into view |
| Logo strip | Continuous marquee scroll | Auto |
| Testimonials | Fade transition | Auto every 5s |
| Milestone teaser | Reveal per item | Scroll into view |

---

## i18n Rules
- All static text in /locales/en.json and /locales/ar.json
- RTL: import RTL Tailwind plugin or use dir="rtl" on html tag
- Flip: flex-row → flex-row-reverse, text-left → text-right for AR
- Font: Arabic use Cairo or Noto Sans Arabic (Google Fonts)
- Numbers: keep in Western numerals (easier for UAE B2B context)
- Date format: DD MMM YYYY for both languages

