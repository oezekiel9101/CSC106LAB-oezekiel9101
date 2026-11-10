# GradePilot — Student GPA Calculator

An original standalone mini-project for **Oluwafemi Ezekiel's COS 106 portfolio**, built with plain HTML, CSS, and JavaScript.

## Features
- Add, edit, and remove courses
- Enter credit units (whole numbers from 1 to 30)
- Select grades A–F on a 5.0 scale (A=5, B=4, C=3, D=2, E=1, F=0)
- Instant credit-weighted GPA calculation
- Automatic browser localStorage saving
- Export courses as CSV
- Clear all entries with confirmation
- Responsive, accessible interface

## Run
Extract the ZIP and open `index.html` in a modern browser. No installation, backend, or internet connection is required.

## Formula
`GPA = sum(credit units × grade points) / sum(credit units)`.
Only rows with valid credit units (1–30) are included. Empty/invalid rows are excluded. This is a GPA calculator, not a cumulative CGPA tracker.

## Files
- `index.html`: page structure
- `style.css`: responsive charcoal, gold, and cream styling
- `script.js`: course management, validation, GPA calculation, local storage, CSV export

## Privacy and academic note
Data stays in the browser's localStorage. Clearing browser data may erase saved courses. The grading scale is illustrative and should be checked against the student's institution.
