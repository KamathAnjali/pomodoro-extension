# Pomodoro Timer Extension

A simple Pomodoro Timer browser extension that stays persistent on all tabs, helping you boost your productivity by managing work and break intervals effortlessly.

## Features

- Floating timer widget visible on every webpage
- Start, pause, and reset timer controls
- Timer countdown from 25 minutes by default
- Desktop notifications when a Pomodoro session finishes
- Syncs timer state across all open tabs

## Installation

1. Clone or download this repository.

2. Open your browser (Chrome, Edge, or any Chromium-based browser).

3. Go to `chrome://extensions/` (or your browser’s extensions page).

4. Enable **Developer mode** (top-right corner).

5. Click **Load unpacked** and select the project folder.

6. The Pomodoro Timer icon will appear in your extension bar. The timer widget will be visible in the bottom-right corner of all tabs.

## Usage

- Click **Start** to begin the Pomodoro session (25 minutes by default).  
- Use **Pause** to pause the timer.  
- Use **Reset** to reset the timer back to 25:00.  
- When the timer finishes, you’ll get a desktop notification reminding you to take a break.

## Customization

- You can change the default timer duration in `background.js` by modifying the `timerDuration` variable (currently set to 25 minutes).

## Contributing

Feel free to open issues or submit pull requests if you want to add features or fix bugs.

## License

MIT License — see `LICENSE` file for details.

---

Made with ❤️ by anj

