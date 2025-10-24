// Life Clock - simple countdown based on "years left" input.
// Saves state to localStorage so the countdown continues across reloads.

const yearsInput = document.getElementById('yearsInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timeDisplay = document.getElementById('timeDisplay');
const metaDisplay = document.getElementById('metaDisplay');
const percentDisplay = document.getElementById('percentDisplay');
const endDateDisplay = document.getElementById('endDateDisplay');
const ring = document.getElementById('ring');

const STORAGE_KEY = 'lifeClock:v1';

// helper: convert years to milliseconds (uses average year length to account for leap years)
function yearsToMs(years){
  const daysPerYear = 365.2425; // average incl. leap years
  return years * daysPerYear * 24 * 3600 * 1000;
}

function formatRemaining(ms){
  if (ms <= 0) return '00:00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const dd = String(days).padStart(2,'0');
  const hh = String(hours).padStart(2,'0');
  const mm = String(minutes).padStart(2,'0');
  const ss = String(seconds).padStart(2,'0');
  return `${dd}:${hh}:${mm}:${ss}`;
}

function saveState(obj){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e){
    return null;
  }
}

let intervalId = null;
let state = loadState() || { active: false };

function startCountdown(years){
  const now = Date.now();
  const totalMs = yearsToMs(Number(years));
  const endsAt = now + totalMs;
  state = {
    active: true,
    years: Number(years),
    totalMs,
    endsAt,
    startedAt: now
  };
  saveState(state);
  updateOnce();
  if(intervalId) clearInterval(intervalId);
  intervalId = setInterval(updateOnce, 1000);
}

function resetCountdown(){
  if(intervalId) clearInterval(intervalId);
  state = { active: false };
  saveState(state);
  timeDisplay.textContent = '--:--:--:--';
  metaDisplay.textContent = 'Enter years and press Start';
  percentDisplay.textContent = '0%';
  endDateDisplay.textContent = '—';
  ring.style.background = 'conic-gradient(var(--accent) 0deg, var(--accent-2) 0deg, rgba(255,255,255,0.04) 0deg)';
}

function updateOnce(){
  if(!state || !state.active){
    return;
  }
  const now = Date.now();
  const remaining = Math.max(0, state.endsAt - now);
  const elapsed = Math.max(0, state.totalMs - remaining);
  const pct = state.totalMs > 0 ? (elapsed / state.totalMs) : 1;
  // format
  timeDisplay.textContent = formatRemaining(remaining);
  metaDisplay.textContent = remaining > 0 ? 'Counting down' : 'The period has ended';
  percentDisplay.textContent = `${Math.round(pct * 100)}%`;
  const endDate = new Date(state.endsAt);
  endDateDisplay.textContent = endDate.toLocaleString();
  // update ring conic gradient
  const degrees = Math.min(360, Math.max(0, pct * 360));
  ring.style.background = `conic-gradient(var(--accent) ${degrees}deg, var(--accent-2) ${degrees}deg, rgba(255,255,255,0.04) ${degrees}deg)`;

  if(remaining <= 0){
    // stop at zero but keep state so user sees final info
    clearInterval(intervalId);
    intervalId = null;
    state.active = false;
    saveState(state);
  }
}

// wire UI
startBtn.addEventListener('click', () => {
  const val = Number(yearsInput.value);
  if (!val || isNaN(val) || val < 0){
    alert('Please enter a non-negative number of years.');
    return;
  }
  startCountdown(val);
});

resetBtn.addEventListener('click', () => {
  if (confirm('Clear saved countdown?')){
    resetCountdown();
  }
});

// initialize from saved state
(function init(){
  if(state && state.active){
    // if endsAt is in the past, show 0 and inactive
    const now = Date.now();
    if(state.endsAt <= now){
      // show final moment
      updateOnce();
      state.active = false;
      saveState(state);
    } else {
      // resume ticking
      updateOnce();
      intervalId = setInterval(updateOnce, 1000);
    }
    yearsInput.value = state.years ?? '';
  } else if (state && state.years){
    yearsInput.value = state.years;
  }
})();