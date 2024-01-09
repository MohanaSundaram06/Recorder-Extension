document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");

  startButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "startRecording" },
        function (response) {
          if (response) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError);
          }
        }
      );
    });
  });

  stopButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "stopRecording" },
        function (response) {
          if (response) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError);
          }
        }
      );
    });
  });
});
