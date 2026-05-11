# Catertech — Backend Document

## Neon DB Connection
```js
// lib/db.js
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export const db = {
  query: (text, params) => pool.query(text, params)
}
```

---

## Auth — Full Flow

### Signup

## Event Management — Guest List Upload + Badge Generation

### CSV Upload → Parse → Save Guests
```js
// app/api/admin/events/[id]/guests/route.js
import { db } from '@/lib/db'
import { parse } from 'csv-parse/sync'
import { nanoid } from 'nanoid'

export async function POST(req) {
  const formData = await req.formData()
  const file = formData.get('file')
  const eventId = req.nextUrl.pathname.split('/')[4]

  const text = await file.text()
  // CSV expected columns: full_name, email, phone, company
  const records = parse(text, { columns: true, skip_empty_lines: true })

  for (const guest of records) {
    const qrCode = nanoid(16) // unique token per guest
    await db.query(
      `INSERT INTO event_guests (event_id, full_name, email, phone, company, qr_code)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [eventId, guest.full_name, guest.email, guest.phone, guest.company, qrCode]
    )
  }

  return Response.json({ success: true, count: records.length })
}
```

### QR Check-in Scan
```js
// app/api/checkin/scan/route.js
import { db } from '@/lib/db'

export async function POST(req) {
  const { qrCode } = await req.json()

  const res = await db.query(
    'SELECT * FROM event_guests WHERE qr_code = $1', [qrCode]
  )
  const guest = res.rows[0]

  if (!guest) {
    return Response.json({ error: 'Unknown QR code' }, { status: 404 })
  }
  if (guest.checked_in) {
    return Response.json({ 
      warning: 'Already checked in', 
      guest: { name: guest.full_name, company: guest.company }
    }, { status: 200 })
  }

  await db.query(
    `UPDATE event_guests 
     SET checked_in = true, checked_in_at = NOW() 
     WHERE qr_code = $1`,
    [qrCode]
  )

  return Response.json({ 
    success: true, 
    guest: { name: guest.full_name, company: guest.company }
  })
}
```

### Badge PDF Generation (per guest)
```js
// lib/badge-generator.js
// uses pdf-lib to generate badge PDF with QR code image

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode'
import { uploadToR2 } from './r2'

export async function generateBadge(guest, eventName) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([252, 360]) // badge size ~3.5 x 5 inch
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // event name header
  page.drawText(eventName, {
    x: 20, y: 320,
    size: 14, font, color: rgb(0.1, 0.1, 0.3)
  })

  // guest name
  page.drawText(guest.full_name, {
    x: 20, y: 280,
    size: 18, font, color: rgb(0, 0, 0)
  })

  // company
  if (guest.company) {
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    page.drawText(guest.company, {
      x: 20, y: 255,
      size: 12, font: regularFont, color: rgb(0.3, 0.3, 0.3)
    })
  }

  // QR code image
  const qrDataUrl = await QRCode.toDataURL(guest.qr_code)
  const qrBase64 = qrDataUrl.split(',')[1]
  const qrImage = await pdfDoc.embedPng(Buffer.from(qrBase64, 'base64'))
  page.drawImage(qrImage, { x: 76, y: 60, width: 100, height: 100 })

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const file = new File([blob], `badge-${guest.qr_code}.pdf`, { type: 'application/pdf' })

  const url = await uploadToR2(file, 'badges')
  return url
}
```

### Post-Event Report Email
```js
// add to lib/resend.js

export async function sendBadgesReadyEmail({ to, eventName, downloadUrl }) {
  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to,
    subject: `Your event badges are ready — ${eventName}`,
    html: `
      <h2>Badges Ready for ${eventName}</h2>
      <p>All guest badges have been generated with QR codes.</p>
      <a href="${downloadUrl}" 
         style="background:#1a1a2e;color:white;padding:12px 24px;text-decoration:none;border-radius:6px">
        Download Badges
      </a>
    `
  })
}

export async function sendEventReportEmail({ to, eventName, reportUrl }) {
  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to,
    subject: `Post-Event Report — ${eventName}`,
    html: `
      <h2>Event Report: ${eventName}</h2>
      <p>Your post-event report is ready for download.</p>
      <a href="${reportUrl}"
         style="background:#1a1a2e;color:white;padding:12px 24px;text-decoration:none;border-radius:6px">
        Download Report
      </a>
    `
  })
}
```

### Dependencies to Install
```bash
npm install csv-parse nanoid pdf-lib qrcode
npm install @types/qrcode --save-dev
```

