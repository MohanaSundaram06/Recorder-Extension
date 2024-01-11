var recorder = null;
var chunks = [];
let userStream;
let displayStream;

async function startRecording(withAudio, withVideo) {
  let displayMediaOptions = {
    video: true,
    audio: withAudio,
    surfaceSwitching: "exclude",
    selfBrowserSurface: "exclude",
    systemAudio: "exclude",
  };

  // Fetch the display media stream
  try {
    displayStream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );

    // Fetch the user media stream and make the content display on the screen
    if (withVideo) {
      userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      createVideoContainer(userStream);
    }

    recorder = new MediaRecorder(displayStream);

    recorder.start();

    recorder.onstop = () => {
      const recordedBlob = new Blob(chunks, { type: "video/webm" });
      chunks = [];
      const videoUrl = URL.createObjectURL(recordedBlob);

      displayStream.getTracks().forEach((track) => {
        if (track.readyState === "live") track.stop();
      });

      if (withVideo) {
        console.log("Stopping the user media streams");
        userStream.getTracks().forEach((track) => {
          if (track.readyState == "live") track.stop();
        });
        removeVideoContainer();
      }
      chrome.runtime.sendMessage({
        action: "createTab",
        url: videoUrl,
      });
    };

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
      recorder = null;
    };
  } catch (e) {
    console.log("Issuse while Attempting to record ", e);
  } finally {
    return recorder;
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (!recorder || recorder.state !== "recording") {
    if (message.action === "recordWithVideo") {
      if (await startRecording(true, true))
        sendResponse({ state: recorder.state });
    } else if (message.action === "recordWithAudio") {
      if (await startRecording(true, false))
        sendResponse({ state: recorder.state });
    } else if (message.action === "recordScreen") {
      if (await startRecording(false, false))
        sendResponse({ state: recorder.state });
    }
  }

  if (message.action === "stopRecording") {
    if (!recorder) {
      return console.log("no recorder found");
    }
    sendResponse({ state: "stopped" });
    console.log("stopping video");
    recorder.stop();
  }
});
