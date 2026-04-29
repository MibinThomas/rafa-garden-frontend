# Homepage Hero Mobile Redesign Plan

The current mobile hero section uses a vertical accordion where 4 categories share the screen height evenly. This forces the content into extremely small spaces, resulting in unreadable font sizes (`text-[6px]` and `text-[0.45rem]`) and a cramped layout.

## User Review Required

> [!IMPORTANT]
> Please review the proposed redesign options and let me know your preference. Option 1 is recommended for the best mobile user experience.

### Option 1: Full-Screen Horizontal Swipe Carousel (Recommended)
Instead of dividing the screen into 4 small vertical slices, we show one category at a time taking up the full screen height.
- **Layout**: Users swipe left/right to view different categories.
- **Readability**: Font sizes can be increased to standard readable sizes (e.g., `14px` - `16px`).
- **Visuals**: Product images can be showcased much larger.
- **Background**: The entire screen background transitions to the active category's color.

### Option 2: Vertically Expanding Accordion
We keep the 4 items on the screen, but when a category is tapped, it expands vertically to take up most of the screen (e.g., 70% height), while the other three shrink to narrow tabs at the top/bottom.
- **Layout**: Tapping expands the item vertically.
- **Readability**: The active item has enough room for larger, readable text. Non-active items just show the category title.
- **Visuals**: The image and text can stack vertically in the expanded space.

## Open Questions

> [!NOTE]
> Which design option do you prefer? (Option 1 or Option 2)
> Do you want to keep the "Buy Now" and "View More" button styles similar, just scaled up appropriately?

## Proposed Changes

### `c:\MIB\rafa-garden-frontend\src\components\CategoryHero.tsx`
#### [MODIFY] CategoryHero.tsx

**If Option 1 is chosen:**
- Replace the mobile `div.flex.md:hidden` block with a swipable carousel using `framer-motion` (e.g., `drag="x"` or simple horizontal scroll snap).
- Update typography classes from `text-[6px]` and `text-[0.45rem]` to `text-xs`, `text-sm`, and `text-base`.
- Adjust image positioning and sizing to utilize the full mobile canvas.

**If Option 2 is chosen:**
- Modify the `flex-1` behavior on mobile to conditionally apply `flex-[3]` (or similar) to the active item, and `flex-none h-16` to inactive items.
- Re-layout the active item's internal content to stack vertically (image on top, text below) to maximize the available expanded space.
- Increase font sizes significantly.

## Verification Plan

### Automated Tests
- Run the local dev server using `npm run dev`.

### Manual Verification
- Open the application in the browser.
- Use responsive design mode (DevTools) to simulate mobile screens (iPhone, Android).
- Verify that text is fully legible without zooming.
- Test the interaction (swiping or tapping) to ensure smooth transitions.
- Ensure the desktop layout remains completely unaffected.
