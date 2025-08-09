
function injectPomodoroOverlay() {
  if (document.getElementById('pomodoro-timer-container')) return;
  const timerContainer = document.createElement('div');
  timerContainer.id = 'pomodoro-timer-container';
  timerContainer.style.position = 'fixed';
  timerContainer.style.bottom = '30px';
  timerContainer.style.right = '30px';
  timerContainer.style.zIndex = '999999';
  timerContainer.style.background = 'white';
  timerContainer.style.border = '1px solid #ccc';
  timerContainer.style.borderRadius = '10px';
  timerContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  timerContainer.style.padding = '16px';
  timerContainer.style.fontFamily = 'sans-serif';
  timerContainer.style.width = '220px';
  timerContainer.style.textAlign = 'center';
  timerContainer.innerHTML = `
    <div id="pomodoro-timer-display">25:00</div>
    <button id="pomodoro-start-btn">Start</button>
    <button id="pomodoro-pause-btn" disabled>Pause</button>
    <button id="pomodoro-reset-btn">Reset</button>
    <span id="pomodoro-close-btn" style="position:absolute;top:6px;right:12px;cursor:pointer;font-size:1.2em;">×</span>
  `;
  document.body.appendChild(timerContainer);

  const display = document.getElementById('pomodoro-timer-display');
  const startBtn = document.getElementById('pomodoro-start-btn');
  const pauseBtn = document.getElementById('pomodoro-pause-btn');
  const resetBtn = document.getElementById('pomodoro-reset-btn');
  const closeBtn = document.getElementById('pomodoro-close-btn');

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateDisplay(timeLeft) {
    display.textContent = formatTime(timeLeft);
  }

  startBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'startTimer' });
  });
  pauseBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'pauseTimer' });
  });
  resetBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'resetTimer' });
  });
  closeBtn.addEventListener('click', () => {
    timerContainer.remove();
  });

  // Listen for updates from background
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'timerUpdate') {
      updateDisplay(message.timeLeft);
      if (message.timerRunning) {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
      } else {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
      }
    }
  });

  // Ask background for current state on load
  chrome.runtime.sendMessage({ type: 'getState' }, (response) => {
    updateDisplay(response.timeLeft);
    if (response.timerRunning) {
      startBtn.disabled = true;
      pauseBtn.disabled = false;
    }
  });
}

injectPomodoroOverlay();

// Observe DOM changes to re-inject overlay if removed
const observer = new MutationObserver(() => {
  if (!document.getElementById('pomodoro-timer-container')) {
    injectPomodoroOverlay();
  }
});
observer.observe(document.body, { childList: true });
