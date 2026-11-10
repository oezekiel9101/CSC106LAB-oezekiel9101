# QuizForge — Interactive Programming Quiz

**Created for:** Oluwafemi Ezekiel's COS 106 portfolio

A standalone responsive quiz application made with HTML, CSS and vanilla JavaScript. No framework, server, internet connection or installation is required.

## Run

Open `index.html` in a modern browser. Keep `style.css` and `script.js` in the same folder.

## Features

- 15 multiple-choice questions across HTML, CSS, JavaScript, Python and MySQL.
- 20-second timer for each question; unanswered questions time out automatically.
- Instant answer feedback and explanations.
- Progress bar and running score.
- Final score, accuracy, and replay button.
- Personal best saved in browser `localStorage` (when storage is permitted).
- Responsive design and keyboard-accessible buttons.

## Key JavaScript concepts

- `addEventListener` handles start, answer, next and restart actions.
- `setInterval` and `clearInterval` manage the question countdown.
- DOM manipulation renders question buttons and feedback.
- `localStorage` remembers the best score between visits.
- State variables prevent duplicate answers and track quiz progress.

## Note

The questions are educational examples. No personal information is collected or transmitted. The high score is local to the browser/device.
