# Print.html Implementation Guide

## Overview

This document describes the implementation of `/print.html` for server-side PDF generation using Playwright and Paged.js.

## Architecture

The frontend serves a dedicated print page at `/print.html` that is accessed by the backend PDF generation service. The workflow is:

1. Backend creates a one-time token with quote data
2. Backend launches Playwright to navigate to: `https://aq-tailwind-quoteedi-nyhc.bolt.host/print.html?token=xxx`
3. Frontend fetches data from backend API: `GET /api/pdf/data?token=xxx`
4. Frontend renders the quote in flat/print mode
5. Paged.js applies pagination and CSS @page rules
6. Frontend signals readiness via `window.__PDF_READY__ = true`
7. Backend captures the page as PDF

## File Structure

```
/print.html                           # Print page entry point
/src/main-print.tsx                   # Print entry point script
/src/print.tsx                        # PrintableQuote component
/src/styles/print.css                 # Print-specific CSS with Paged.js rules
```

## Configuration

### Environment Variables

Create or update `.env` file:

```bash
VITE_BACKEND_URL=http://localhost:8080
```

For production deployment on Bolt, configure:

```bash
VITE_BACKEND_URL=https://your-backend-url.run.app
```

### Vite Configuration

The `vite.config.ts` is configured for multi-entry build:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        print: resolve(__dirname, 'print.html'),
      },
    },
  },
});
```

## PrintableQuote Component

The `src/print.tsx` component handles:

1. **Token extraction** from URL parameters
2. **Data fetching** from backend API
3. **Error handling** for invalid/expired tokens (400/404/410)
4. **Resource loading** - waits for webfonts and images
5. **Paged.js initialization** - dynamic import and pagination
6. **Ready signal** - sets `window.__PDF_READY__ = true`

### Key Features

- No auto-save or interactive elements
- Uses `printMode={true}` and `flatMode={true}`
- Header and footer hidden from body (handled by Paged.js running elements)
- Loading and error states for user feedback

## Print CSS Configuration

The `src/styles/print.css` implements:

### Page Setup

```css
@page {
  size: A4 portrait;
  margin-top: 3.5cm;
  margin-bottom: 2.5cm;
  margin-left: 2cm;
  margin-right: 2cm;
}
```

### Running Header/Footer

```css
.print-header {
  position: running(pageHeader);
}

.print-footer {
  position: running(pageFooter);
}

/* Hidden in main flow, visible in margin boxes */
.print-header,
.print-footer {
  visibility: hidden !important;
  height: 0 !important;
  overflow: visible !important;
}

@page {
  @top-center {
    content: element(pageHeader);
  }
  @bottom-center {
    content: element(pageFooter);
  }
}
```

### Content Width

```css
[data-component="quote-flat-view"] {
  max-width: 18cm;
  margin: 0 auto;
}
```

### Color Preservation

```css
* {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
```

### Page Break Rules

- Titles: `page-break-after: avoid`
- Following elements: `page-break-before: avoid`
- Atomic elements (rows, list items): `page-break-inside: avoid`
- Large containers: no break-inside to allow pagination

## Testing Locally

### 1. Start the Backend

Ensure the backend is running and accepting requests from the frontend origin.

### 2. Build the Frontend

```bash
npm run build
```

### 3. Serve the Built Files

```bash
npx vite preview
```

### 4. Test the Print Page

Open in browser:
```
http://localhost:4173/print.html?token=test-token
```

### 5. Check Console

Verify the following in browser console:
- Data fetched successfully
- Paged.js rendered
- `window.__PDF_READY__ === true`

## Backend Requirements

The backend must:

1. **Generate one-time tokens** with embedded quote data
2. **Expose API endpoint**: `GET /api/pdf/data?token=xxx`
3. **Configure CORS** to allow `https://aq-tailwind-quoteedi-nyhc.bolt.host/`
4. **Launch Playwright** with sufficient timeout (e.g., 30s)
5. **Wait for signal**: Poll `window.__PDF_READY__` before capture
6. **Invalidate tokens** after use (410 status for reuse attempts)

## Security Considerations

- Tokens are single-use and expire after retrieval
- CORS restricts access to authorized frontend origins only
- No sensitive data persisted on frontend
- Backend validates all token requests

## Troubleshooting

### Token errors (400/404/410)

Check backend logs and ensure token is valid and not expired.

### Images not loading

Ensure images are accessible via CORS or use data URIs.

### Paged.js not paginating

Check console for errors. Verify print.css is loaded.

### Fonts missing

Wait for `document.fonts.ready` before calling Paged.js.

### Header/footer duplicated

Ensure `.print-header` and `.print-footer` have `visibility: hidden` and `height: 0`.

## Production Deployment

### Frontend (Bolt)

1. Configure `VITE_BACKEND_URL` environment variable
2. Deploy to `https://aq-tailwind-quoteedi-nyhc.bolt.host/`
3. Verify `/print.html` is accessible

### Backend

1. Update CORS to allow frontend origin
2. Configure Playwright with correct frontend URL
3. Set appropriate timeouts for page load and pagination
4. Monitor token usage and expiration

## Performance Optimization

- Paged.js loads dynamically only on print page
- Separate bundle for print reduces main app size
- Images lazy-loaded after initial render
- CSS minified and optimized for print

## Future Enhancements

- Support for multiple page sizes (A4, Letter, etc.)
- Configurable margins via query parameters
- Print preview mode for debugging
- Watermark support
- Digital signature rendering
