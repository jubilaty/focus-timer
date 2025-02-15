let timer;
let timeLeft = 0;
let running = false;

const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");
const timerDisplay = document.getElementById("timer");
const quoteDisplay = document.getElementById("quote");
const timeInput = document.getElementById("timeInput");
const setTimeBtn = document.getElementById("setTime");

const quotes = [
  "stay focused!",
  "keep pushing forward!",
  "you got this!",
  "hard work pays off!",
  "just one more step!"
];

let quoteIndex = 0;

function updateTimerDisplay(time) {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

chrome.storage.local.get(["timeLeft"], (data) => {
  let time = data.timeLeft || 0;
  updateTimerDisplay(time);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.timeLeft) {
    updateTimerDisplay(changes.timeLeft.newValue);
  }
});

startPauseBtn.addEventListener("click", () => {
  chrome.storage.local.get("running", (data) => {
    if (data.running) {
      chrome.runtime.sendMessage({ action: "pauseTimer" }, () => {
        startPauseBtn.textContent = "Start";
      });
    } else {
      chrome.runtime.sendMessage({ action: "startTimer" }, () => {
        startPauseBtn.textContent = "Pause";
      });
    }
  });
});

resetBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "resetTimer" }, () => {
    startPauseBtn.textContent = "Start";
  });
});

setTimeBtn.addEventListener("click", () => {
  let minutes = parseInt(timeInput.value);
  if (!isNaN(minutes) && minutes > 0) {
    let seconds = minutes * 60;
    chrome.runtime.sendMessage({ action: "setTime", time: seconds });
  }
});

setInterval(() => {
  quoteDisplay.textContent = quotes[quoteIndex];
  quoteIndex = (quoteIndex + 1) % quotes.length;
}, 5000);

