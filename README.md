# Life Clock

A simple, visually pleasing life countdown clock.

Features:
- Enter how many years you think you have left and press Start.
- The clock counts down in days:hours:minutes:seconds.
- Shows the estimated "end" date and the percent of the entered period that has elapsed.
- Saves your last entry in your browser (localStorage).

How to use:
1. Open `index.html` in a browser (or host with a static server).
2. Enter the number of years you think you have left (decimals allowed) and click Start.
3. To clear the saved countdown, press Reset.

Files:
- `index.html` — UI
- `style.css` — styles
- `script.js` — countdown logic
- `README.md` — this file

Notes:
- The app uses an average year length (365.2425 days) to account for leap years.
- Data is stored locally in the browser only.
