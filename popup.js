document.addEventListener("DOMContentLoaded", () => {
  const rcVideo = document.getElementById("rc-video");
  const rcScreen = document.getElementById("rc-screen");
  const recordWithAudio = document.getElementById("rc-screen-audio");
  const stopButton = document.getElementById("stopButton");

  rcVideo.addEventListener("click", () => {
    sendQuery("recordWithVideo");
  });

  rcScreen.addEventListener("click", () => {
    sendQuery("recordScreen");
  });

  recordWithAudio.addEventListener("click", () => {
    sendQuery("recordWithAudio");
  });

  stopButton.addEventListener("click", () => {
    sendQuery("stopRecording");
  });

  const sendQuery = (actionType) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      await chrome.tabs.sendMessage(
        tabs[0].id,
        { action: actionType },
        (response) => {
          console.log("started " + response);
        }
      );
    });
  };
});
