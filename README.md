# TenderFlow — Tender Document Package Builder

A browser-only tender package builder for the AI DevFest competition.

## Run

The app is static. Open `index.html` in a modern browser.

For the smoothest browser behavior, you can also serve the folder with any local static server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Privacy

Tender files are processed locally in the browser. The application does not upload tender PDFs or requirements to a backend, database, or external storage.

`pdf-lib` is loaded as a browser library from jsDelivr. No tender document data is sent to that CDN.

## Expected requirements.json

The parser expects a structure like:

```json
{
  "tender_id": "T-2026-0417",
  "tender_title": "Example Tender",
  "procuring_entity": "Example Authority",
  "bidder": "Example Company",
  "submission_deadline": "2026-12-31T16:00:00+06:00",
  "requirements": [
    {
      "id": "trade-license",
      "title_en": "Trade License",
      "title_bn": "ট্রেড লাইসেন্স",
      "order": 1,
      "mandatory": true,
      "has_expiry": true
    }
  ]
}
```

The application also accepts common camelCase variants for top-level fields and expiry fields.

## Implemented

- Dynamic requirements JSON loading
- Requirement sorting by `order`
- Local PDF-only validation
- Up to 30 PDFs / 50 MB
- PDF page counting
- Corrupt/password-protected PDF error handling
- SHA-256 content-based duplicate detection
- One-to-one document matching
- Filename-based suggestions requiring confirmation
- Live expiry validation against submission deadline
- Blocking readiness summary
- English/Bangla UI
- English-only generated cover
- Ordered PDF package generation
- Original document visual content retained with a reserved footer strip
- `Tender ID | Page X of Y` footer on every generated page
- Browser download as `<tender_id>_Package.pdf`

## Note

The browser must be able to load the `pdf-lib` script. If the competition environment requires completely offline operation, download the matching `pdf-lib.min.js` file once and replace the CDN `<script>` tag with a local script reference.
