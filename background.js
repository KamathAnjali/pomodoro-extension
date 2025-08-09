let timerDuration = 25 * 60; // seconds
let timeLeft = timerDuration;
let timerRunning = false;
let timerInterval = null;

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    broadcastState();
  } else {
    clearInterval(timerInterval);
    timerRunning = false;
    notifyFinished();
    broadcastState();
  }
}

function broadcastState() {
  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      chrome.tabs.sendMessage(tab.id, {
        type: "timerUpdate",
        timeLeft,
        timerRunning,
      });
    }
  });
}

function notifyFinished() {
  chrome.notifications.create('', {
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Pomodoro Finished!',
    message: 'Time to take a break or start a new session.'
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "startTimer") {
    if (!timerRunning) {
      timerRunning = true;
      timerInterval = setInterval(tick, 1000);
      broadcastState();
    }
  } else if (message.type === "pauseTimer") {
    timerRunning = false;
    clearInterval(timerInterval);
    broadcastState();
  } else if (message.type === "resetTimer") {
    timerRunning = false;
    clearInterval(timerInterval);
    timeLeft = timerDuration;
    broadcastState();
  } else if (message.type === "getState") {
    sendResponse({ timeLeft, timerRunning });
  }
});
