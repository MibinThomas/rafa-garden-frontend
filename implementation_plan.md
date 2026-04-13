# Redesigning CMS to Support Mobile Content & Global Custom Fonts

This updated implementation plan details how we will redesign the Admin Panel and the existing backend architecture to solve two major requirements:
1. Allowing administrators to edit mobile-specific text content natively.
2. Empowering administrators to upload raw font files (`.woff`, `.ttf`) and globally swap the application typography dynamically.

---

## Part 1: Mobile Screen Editable Subsystems

### Database Layer
#### [MODIFY] `src/models/Category.ts`
- Extend the `CategorySchema` to include three new optional fields:
  - `mobileTitle` (String)
  - `mobileShortDesc` (String)
  - `mobileActiveDesc` (String)

#### [MODIFY] `src/lib/data.ts`
- Extend the `Category` Typescript interface mapping to officially support the 3 new mobile properties.

### Admin CMS Panel Updates
#### [MODIFY] `src/components/admin/CmsForm.tsx`
- **Initial State Tracker**: Enhance the layout `formData` state to track the 3 parameters.
- **Mobile Content Panel**: Construct a new visual form grouping titled "Mobile Screen Content" with `<textarea>` elements allowing for `\n` line breaks.

### Consumer Frontend Interface
#### [MODIFY] `src/components/CategoryHero.tsx`
- **Dynamic Processing**: Exchange the static string `"Pure <br /> botanical <br /> refreshment"` with the database-fed `cat.mobileTitle`, utilizing `whitespace-pre-line` to handle the CMS carriage returns without injecting raw HTML.

---

## Part 2: Dynamic Font File Upload Engine

### Site Content Model & Seeding
#### [MODIFY] `src/models/SiteContent.ts`
- Add `"font"` to the allowed structural `type` enums (currently `text | image | json`).

#### [MODIFY] `src/lib/seed.ts` (or equivalent initialization hook)
- Create two static keys in the `SiteContent` table: 
  - Key: `global.font.primary` (Label: "Main Brand Heading Font")
  - Key: `global.font.secondary` (Label: "Secondary Body Font")

### File Upload and CMS Controller
#### [MODIFY] `src/components/admin/SiteContentForm.tsx`
- Add a dedicated condition when `type === "font"`.
- This will render a unique file upload mechanism strictly accepting `.woff`, `.woff2`, and `.ttf` formats.
- Once uploaded, it passes the binary to `Vercel Blob Storage` (via the existing `/api/upload` endpoint) and persists the generated URL in the database.

### Global CSS Injection
#### [MODIFY] `src/app/layout.tsx`
- **Server Component Fetching**: Import the `SiteContent` Mongoose model directly and fetch the dynamic font URLs during the root server-side sweep.
- **`<style>` Injection**: Render a dynamic `<style>` block at the `<head>` root:
```css
@font-face {
  font-family: 'Dynamic-Heading';
  src: url('{{global.font.primary.value}}');
}
:root {
  --font-dynamic-playfair: 'Dynamic-Heading', serif !important;
}
```
- Map these new CSS variables explicitly over the existing Tailwind font utilities (like `--font-playfair` in the CSS root), ensuring that if a font is uploaded via the admin panel, it natively overrides the entire project instantaneously without requiring code commits.

---

## User Review Required
> [!IMPORTANT]
> The Font Injection layer is incredibly powerful. It means that the instant you upload a `.woff` font in the admin panel, the entire global website layout will dynamically repopulate with that new font structure.
>
> Please review this scaled-up architecture (Mobile CMS + Global Font Flow) and reply with **"Approved"** to kick off execution!
