# SpendWise — Personal Expense Tracker

A responsive, standalone personal finance tracker created for Oluwafemi Ezekiel's COS 106 portfolio using HTML, CSS and vanilla JavaScript.

## Run locally

Open `index.html` in a modern browser. No installation or internet connection is required.

## Features

- Add, edit and delete income and expense transactions.
- See automatically calculated income, expenses and balance in Nigerian naira (NGN).
- Filter by transaction type and category, or search descriptions.
- View a spending breakdown by category.
- Save records in the browser using `localStorage`.
- Export all transactions as CSV.
- Responsive interface with accessible form labels and confirmation before deleting.

## Notes

- Data stays in the current browser/device; it is not synced to a server.
- Clearing browser storage or using another browser can remove or hide saved records. Export CSV to keep a copy.
- This is an educational portfolio project, not a banking or accounting service.

## Core files

- `index.html` — page layout and transaction form
- `styles.css` — responsive styles
- `app.js` — CRUD operations, filtering, calculations, browser storage and CSV export
