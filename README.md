# interview-practice-2026

## Printable DSA booklet (PDF)

Generate a print-ready PDF for the DSA for beginners course:

```bash
npm run export:dsa:pdf
```

Output:

- `exports/dsa-printable/DSA-for-beginners-printable.pdf`

What this export includes:

- table of contents
- custom index page with block page ranges
- page numbers in footer
- blank separator page between top-level blocks
- pagination controls to reduce orphaned titles and cut images
- automatic inclusion of all numbered top-level folders in `neetcode courses/DSA for beginners`

Prerequisites on Windows:

1. Install Pandoc: https://pandoc.org/installing.html
2. Install a LaTeX engine (MiKTeX recommended): https://miktex.org/download

If prerequisites are missing, the export command exits with a clear message.

## Editable DSA booklet (DOCX)

Generate a Word document for manual adjustment:

```bash
npm run export:dsa:docx
```

Output:

- `exports/dsa-printable/DSA-for-beginners-printable.docx`

What the DOCX export includes:

- table of contents structure
- the same block ordering as the PDF export
- page-break separators between top-level blocks
- a manual index table you can fill in after editing page layout in Word
- automatic inclusion of all numbered top-level folders in `neetcode courses/DSA for beginners`

DOCX notes:

1. The PDF export can compute stable page ranges because the layout is fixed.
2. The DOCX export is meant for manual editing, so the index page uses placeholders for page ranges.
3. After opening the file in Word, update the table of contents and fill the index page ranges once your layout is final.

DOCX prerequisite:

1. Install Pandoc: https://pandoc.org/installing.html
