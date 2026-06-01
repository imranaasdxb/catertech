
# Catertech — Business Requirements Document (BRD)
## Site Goals
1. Generate corporate enquiries and RFQ submissions from hotels, venues, caterers
2. Allow general customers to browse products and submit cart-based RFQ
3. Build brand trust through Company Journey, blog, client logos, testimonials
5. Be fully self-manageable by Catertech team via admin panel

---

## User Types
| User | Description | Access |
|------|-------------|--------|
| Guest | Any visitor, no login | Public pages, shop, contact, enquiry forms |
| User | Signed up general buyer | Cart, checkout, order history |
| Corporate | Trade account holder | Trade portal, RFQ, saved quotes |
| Admin | Catertech staff | Full admin panel |

---

## Sitemap

| Page | URL | Type |
|------|-----|------|
| Home | / | Primary |
| About Us | /about | Primary |
| Company Journey | /about/journey | Sub |
| Accreditations | /about/accreditations | Sub |
| Products & Services | /services | Primary |
| Catering Equipment | /services/catering-equipment | Sub |
| Event Equipment Rental | /services/event-rental | Sub |
| Kitchen Equipment | /services/kitchen-equipment | Sub |
| Browse & Rent | /shop | Primary |
| Product Category | /shop/[category] | Dynamic |
| Product Page | /shop/[product] | Dynamic |
| Cart | /cart | System |
| Checkout / RFQ | /checkout | System |
| Trade & Corporate | /trade | Primary |
| Simple Enquiry | /trade/enquiry | Sub |
| Request a Quote | /trade/rfq | Sub |
| Event Management | /event-management | Primary |
| └ Photography & Videography | /event-management/media | Sub |
| └ Event Report | /event-management/report | Sub |
| └ Event Check-in / Check-out | /event-management/checkin | Sub |
| └ Badge & QR Generator | /event-management/badges | Sub |
| Blog | /blog | Primary |
| Blog Post | /blog/[slug] | Dynamic |
| Contact | /contact | Primary |
| Privacy Policy | /privacy-policy | Legal |
| Terms & Conditions | /terms | Legal |
| 404 | /404 | System |
| Admin Dashboard | /admin | Protected |
| Admin Products | /admin/products | Protected |
| Admin RFQ | /admin/rfq | Protected |
| Admin Blog | /admin/blog | Protected |
| Admin Users | /admin/users | Protected |

---

## Page Requirements Summary

### Home (/)
- Full-screen hero: video/parallax, animated headline, 2 CTAs
- Trust bar: 4 animated stats (20+ Years, 1000+ Events, 500+ Clients, Dubai & RAK)
- Services: 3 cards with hover animation
- Featured products: 6-8 grid, filter tabs (All/Catering/Events/Kitchen)
- Trade & Corporate CTA block
- Company Journey teaser: 4-5 milestones horizontal strip
- Client logo strip: auto-scroll marquee, 8-12 logos
- Testimonials: 3 rotating cards, auto 5s
- Deseri & Smart Electronics partner block
- Blog preview: 3 latest posts
- Footer: 4 column, WhatsApp float button, newsletter strip

### About (/about)
- Company intro, mission, values
- Why Choose Us: 6 value blocks
- Accreditations placeholder

### Company Journey (/about/journey)
- Full-screen vertical scroll timeline
- Each milestone: full-width section, year (large), title, description, image
- Alternating left/right desktop layout
- Scroll-triggered reveal animations
- 12 milestones from 2005 to 2025 (see BRD section 4.2.1)

### Services (/services)
- 3 hero cards per service
- How We Work: 4-step animation
- Industries We Serve: badge grid
- Trade vs Browse & Buy comparison callout

### Browse & Rent (/shop)
- Product catalogue with filters (price, type, brand, keyword)
- Product page: gallery, specs, price, stock, Add to Cart, WhatsApp button
- Cart: qty edit, remove, total, proceed to checkout
- Checkout: customer details, UAE address, delivery option
- RFQ email auto-sent to customer + Catertech on submit

### Product Categories
- Catering Equipment: Chafing Dishes, Serving Trays, Beverage Equipment, Uniforms
- Kitchen Equipment: Ovens, Refrigeration, Food Prep, Dishwashing
- Event Equipment: Tables & Chairs, Linen, Display & Staging, Décor

### Trade & Corporate (/trade)
- Landing: 2 cards (Quick Enquiry + Request Quote)
- Simple Enquiry form: Company, Contact, Phone, Email, Emirate, Service, Message, File
- RFQ form: Company, Trade Licence, Contact, Phone, Email, Emirate, Date, Budget, line-item table, File Upload
- On RFQ submit: unique reference number, auto-email to client + Catertech

### Event Management & Planning (/event-management)

#### What This Service Is
Catertech extends beyond equipment rental into full event support services.
Targeting customers who rent equipment from Catertech and need additional
on-ground services for their event in Dubai and GCC.

#### Service Offerings
| Service | Description |
|---------|-------------|
| Photography | Professional event photography package |
| Videography | Event video coverage, reels, highlight videos |
| Event Report | Post-event report with photos, attendance, summary doc |
| Event Check-in / Check-out | Staff-managed or self-serve guest check-in system |
| Badge Generation + QR Scan | Branded badges with unique QR code per guest, scanned on entry |

#### Page Requirements — Landing (/event-management)
- Hero: full-width banner image of a premium Dubai event
- Heading: "Complete Event Services — From Equipment to Execution"
- Subheading: "We supply the equipment. We manage the event."
- 5 service cards: Photography, Videography, Event Report, Check-in/Check-out, Badge & QR
- Each card: icon, title, short description, "Enquire Now" CTA
- Target audience callout: "Serving Corporate Events, Weddings, Government Functions & Private Events across Dubai and GCC"
- CTA block: "Already renting equipment from us? Bundle with Event Services for a seamless experience"
- Enquiry form at bottom (same as Trade enquiry form)

#### Page Requirements — Photography & Videography (/event-management/media)
- Service description: what's included (hours, deliverables, turnaround)
- Package tiers: Basic / Standard / Premium (pricing TBC by client)
- Gallery: sample work (photos/video thumbnails — to be supplied by Catertech)
- CTA: "Book for Your Event" → opens enquiry form with service pre-selected

#### Page Requirements — Event Report (/event-management/report)
- Description: what the event report includes (attendance count, photo summary, timeline, branded PDF)
- Sample report preview (mockup or real — to be supplied)
- CTA: "Request Event Report Service"

#### Page Requirements — Event Check-in / Check-out (/event-management/checkin)
- Description: how the check-in system works
- Two modes: Staff-managed (Catertech team operates check-in desk) and Self-serve (tablet kiosk)
- Features: guest list upload (CSV/Excel), real-time attendance count, check-out tracking
- CTA: "Add Check-in Service to Your Event"

#### Page Requirements — Badge & QR Generator (/event-management/badges)
- Description: branded badge design + printing + QR code per guest
- QR code links to guest profile or is scanned at entry for check-in
- Customisation: client logo, event name, colour scheme on badge
- Process: 1. Upload guest list → 2. Choose badge template → 3. Catertech prints + delivers → 4. Scan on entry
- CTA: "Generate Badges for Your Event"

#### Functional Requirements (Tech)
| Feature | Requirement |
|---------|-------------|
| Guest list upload | CSV/Excel upload → parsed + saved to DB |
| Badge generation | PDF generation per guest with QR code embedded |
| QR code | Unique per guest, links to guest record in DB |
| Check-in scan | Admin/staff scans QR via mobile camera → marks guest as checked-in |
| Real-time count | Live dashboard showing checked-in / total guests |
| Event report export | Auto-generate PDF report post-event with stats + photos |
| Enquiry form | Same fields as trade enquiry + event date, expected guest count, services needed |

#### Target Market
- Corporate event organisers in Dubai and GCC
- Wedding planners who rent Catertech equipment
- Government and municipality event teams
- Hotel banquet and events departments
- Any Catertech equipment rental customer who needs on-ground support

#### Admin Panel Requirements (additions)
- Events Manager section in admin panel
- Create event: name, date, venue, client, guest count
- Upload guest list (CSV) → system generates QR per guest
- Badge template selector + generate all badges as PDF
- Live check-in dashboard: scanned count vs total
- Export post-event report as PDF


### Blog (/blog)
- 7-10 event story posts at launch
- Card grid: photo, title, category tag, date, excerpt
- Filter by category (Hotel/Corporate/Wedding/Government/F&B)
- Each post: share buttons (Instagram, Facebook, LinkedIn, WhatsApp)
- Instagram embed option per post
- Open Graph tags for rich WhatsApp/LinkedIn previews

### Contact (/contact)
- Contact form with reCAPTCHA
- WhatsApp click-to-chat
- Google Map embed
- Deseri & Smart Electronics partner card

---

## Email Triggers
| Event | Recipient | Content |
|-------|-----------|---------|
| Signup OTP | User | 6-digit OTP code |
| Simple Enquiry submit | User + Catertech | Enquiry summary |
| RFQ submit | User + Catertech | RFQ reference + full details |
| Checkout RFQ | User + Catertech | Cart items + customer info |
| Newsletter signup | User | Welcome email |

---

## Admin Panel Requirements
- Login: email + password, role = admin only
- Dashboard: stats (total RFQs, enquiries, products, blog posts)
- Products: add/edit/delete, upload images to R2, set category/price/stock
- RFQ Manager: view all RFQs, filter by status, mark as responded
- Enquiries: view all simple enquiries
- Blog: add/edit/delete posts, upload images
- Users: view registered users, change role (user → corporate)
- Settings: site settings, contact info

---

## Partner Integration
- Deseri & Smart Electronics shown on: Home page (after testimonials) + Contact page
- Content: logo, 2-3 line description, Visit Website button (external link)
- Logo + URL to be supplied by client before development

