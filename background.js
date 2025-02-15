let timeLeft = 0;
let running = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "setTime":
      timeLeft = message.time;
      chrome.storage.local.set({ timeLeft });
      sendResponse({ timeLeft });
      break;

    case "startTimer":
      if (!running) {
        running = true;
        chrome.alarms.create("timerAlarm", { periodInMinutes: 1 / 60 });
        chrome.storage.local.set({ running });
      }
      sendResponse({ running });
      break;

    case "pauseTimer":
      running = false;
      chrome.alarms.clear("timerAlarm");
      chrome.storage.local.set({ running });
      sendResponse({ running });
      break;

    case "resetTimer":
      running = false;
      timeLeft = 0;
      chrome.alarms.clear("timerAlarm");
      chrome.storage.local.set({ running, timeLeft });
      sendResponse({ timeLeft, running });
      break;
      
    default:
      break;
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "timerAlarm" && running) {
    if (timeLeft > 0) {
      timeLeft--;
      chrome.storage.local.set({ timeLeft });
    } else {
      running = false;
      chrome.alarms.clear("timerAlarm");
      chrome.storage.local.set({ running });
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Time's Up!",
        message: "You've reached your goal, time for a break!",
        priority: 2,
      });
      chrome.windows.create({
        url: "notification.html",
        type: "popup",
        width: 300,
        height: 200,
      });
    }
  }
});
