let timerDuration = 25 * 60; // 25 minutes in seconds
let timeLeft = timerDuration;
let timerInterval = null;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      notifyFinished();
      return;
    }
    timeLeft--;
    updateDisplay();
    saveState();
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  saveState();
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timeLeft = timerDuration;
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  saveState();
}

function notifyFinished() {
  if (Notification.permission === "granted") {
    chrome.notifications.create('', {
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Pomodoro Finished!',
      message: 'Time to take a break or start a new session.'
    });
  } else {
    alert('Pomodoro Finished! Time to take a break.');
  }
}

function saveState() {
  chrome.storage.local.set({ timeLeft, isRunning });
}

function loadState() {
  chrome.storage.local.get(['timeLeft', 'isRunning'], (data) => {
    if (data.timeLeft !== undefined) {
      timeLeft = data.timeLeft;
    }
    if (data.isRunning) {
      startTimer();
    } else {
      updateDisplay();
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  });
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
loadState();

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}
