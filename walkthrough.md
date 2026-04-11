# Rafah Garden Admin Panel & CMS Walkthrough

I have successfully implemented a premium Admin Panel and CMS for Rafah Garden, integrated with **MongoDB (Mongoose)** for data persistence and **Vercel Blob Storage** for heritage asset management.

## 🚀 Getting Started (Local Run)

To run the admin panel locally, please follow these steps:

1. **Environment Variables**: Rename `.env.example` to `.env.local` and fill in your `MONGODB_URI` and `BLOB_READ_WRITE_TOKEN`.
2. **Seed Initial Data**: Start the dev server (`npm run dev`) and visit `http://localhost:3000/api/seed`. This will populate your database with the initial categories and products from your static files.
3. **Access Admin**: Navigate to `http://localhost:3000/admin`.

## 🛠️ Key Features

### Premium Dashboard
A high-end executive dashboard featuring:
- **Financial & Engagement Metrics**: Real-time stats on revenue, orders, and products.
- **Visual Analytics**: Custom SVG-based line and donut charts visualizing heritage performance.
- **Glassmorphism Design**: Elegant white/light-grey theme with your brand's Pink/Green accents.

### Content Management System (CMS)
A functional hub to manage your collection:
- **Live Category Management**: Edit titles, subtitles, and colors directly from the interface.
- **Vercel Blob Integration**: Upload hero images directly to the cloud; they are instantly reflected in the CMS and on the site.
- **Dynamic Product Management**: Add or remove products within categories effortlessly.

### Seamless Integration
The website's homepage and shop have been upgraded to:
- **Favor Dynamic Data**: The site now checks the database for updates first.
- **Zero-Downtime Fallback**: If the database is empty or loading, it gracefully falls back to the static data to ensure the cinematic animations remain smooth.

## 🏗️ Technical Architecture

- **Database**: MongoDB via Mongoose (Connection pooling for Next.js).
- **Storage**: Vercel Blob Storage for high-performance image delivery.
- **Routing**: Next.js App Router with secure API endpoints.
- **Styling**: Tailwind 4 with Framer Motion for premium interactions.

---

### Verification Results
- [x] Admin Panel Route (`/admin`) is functional.
- [x] Header is hidden on `/admin` pages.
- [x] Dashboard charts animate correctly.
- [x] CMS Form successfully handles multipart/image uploads to Vercel Blob logic.
- [x] Mongoose models accurately represent the heritage data structure.
