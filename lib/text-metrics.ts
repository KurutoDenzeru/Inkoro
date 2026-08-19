// Shared text-box model for text elements. Measurement (canvas-layer),
// editor render, export preview, and PDF export must all use these exact
// values or the bounding box drifts out of alignment with the text.
// Padding is in PDF user units (scale-independent), matching element x/y.
export const TEXT_LINE_HEIGHT = 1.3;
export const TEXT_PADDING_X = 4;
export const TEXT_PADDING_Y = 4;
