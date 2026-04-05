# Redesign Homepage Hero Section

The goal is to replace the current GSAP scroll-based Hero with a modern, 4-category expanding accordion layout. This will improve navigation and provide a fresh, premium look that directly matches the user's reference image.

## User Review Required

> [!IMPORTANT]
> **Design Aesthetic Update**: I have integrated your provided Color Guide and Typography.
> - **Colors**: We will use `#c81c6a` (Primary Pink), `#9a0c52` (Deep Magenta), `#7fa23f` (Green), and `#bbbdbf` (Grey) on a `#f1f1f2` background.
> - **Typography**: I will use **Playfair Display** for serif headings and **Outfit** (a close match for Avant Garde) for the geometric sans-serif text.

## Proposed Changes

### Assets

### Assets

I have generated four high-quality custom images for the following categories:
- **Dragon Fruit Crush**
- **Dragon Fruit Jam**
- **Tropical Fruits**
- **Nursery Plants**

These will be moved to the `public/` directory during the execution phase.

These will be moved to the `public/` directory upon execution.

### Components

#### [NEW] [CategoryHero.tsx](file:///c:/MIB/rafa-garden-frontend/src/components/CategoryHero.tsx)
- This will be the main component of the new homepage.
- It will feature a 4-column layout (on desktop) that expands on hover or click.
- Each column will display:
  - Sequence number (01, 02, 03, 04).
  - Category name.
  - Subtitle/Description.
  - "View More" button.
- The active/hovered section will show a large product image with a colored background, matching the reference image.

### Pages

#### [MODIFY] [page.tsx](file:///c:/MIB/rafa-garden-frontend/src/app/page.tsx)
- Replace `ExperienceCanvas` with the new `CategoryHero` component.
- Adjust the layout to ensure a seamless transition to the `ProductGrid`.

## Open Questions

1. **Category Links**: Where should the "View More" buttons link to? Should they scroll down to the `ProductGrid` or link to dedicated category pages?
2. **Mobile Layout**: For mobile, would you prefer a vertical stack of these cards or a horizontal slider?

## Verification Plan

### Automated Tests
- No automated tests currently exist for this UI redesign.

### Manual Verification
- Verify the expansion animation is fluid using `framer-motion`.
- Ensure responsiveness across desktop, tablet, and mobile.
- Verify that the four categories display the correct images and copy.
