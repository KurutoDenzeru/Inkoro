## Description

Overhauls export dialog, adds annotation preview, fixes signature/paste/slider/text bugs, and introduces canvas panning and layer list improvements.

## Related Issue

N/A

## Type of Change

- [x] 🐛 Bug fix (non-breaking change that fixes an issue)
- [x] ✨ New feature (non-breaking change that adds functionality)
- [x] 🎨 Style/UI update

## Changes Made

- **Export dialog redesign**: Two-pane desktop layout (preview left, settings right) with responsive mobile split. react-pdf preview with zoom/page controls.
- **Preview layer**: `PreviewLayer` component renders annotation elements as read-only overlay in export PDF preview, matching canvas-layer rendering.
- **Signature pen fix**: Canvas coordinate scaling — mouse coords now multiplied by `canvas.width / rect.width` to match CSS→canvas pixel mapping.
- **Paste handler fix**: Added `e.preventDefault()`, wrapped `getData()` in try-catch. Toolbar paste button now extracts `<img>` from HTML clipboard data for Safari compatibility, with proper fallback to `readText()`.
- **Mobile close button fix**: Added `showCloseButton={false}` to mobile `DialogContent`.
- **Slider value binding**: Base UI Slider expects `number` (not `number[]`) for single-thumb sliders. Fixed all 4 instances.
- **Toolbar tooltip**: "Download" → "Export" in tooltip, aria-label, and mobile menu.
- **Canvas pan**: Hold spacebar + drag to pan (Figma/Photoshop-style). Transparent overlay captures events while panning.
- **Text bounding box**: Replaced DOM `scrollWidth` (constrained by `overflow-wrap: break-word`) with `canvas.measureText()` for accurate auto-sizing. Added `isManualResizeRef`/`isManualDragRef` guards so manual resize/drag is respected and not reverted by auto-fit.
- **Line/Arrow rotation fix**: Endpoint drag now applies inverse rotation to mouse coordinates, keeping endpoints at correct visual position.
- **Layer list stability**: Added `PointerSensor` activation constraint (8px) to prevent accidental drags. Replaced native overflow scroll with shadcn/ui `ScrollArea`.

## Screenshots/Recordings

| Before | After |
|--------|-------|
| N/A | N/A |

## Testing

- [x] I have tested this locally
- [ ] I have added/updated unit tests
- [ ] I have added/updated integration tests

## Checklist

- [x] My code follows the project's coding standards
- [x] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation accordingly
- [x] My changes generate no new warnings or errors
- [ ] I have checked for accessibility compliance
- [x] I have verified responsive design (if applicable)

## Additional Notes

All changes verified with `bun run build`.
