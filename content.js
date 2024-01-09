var recorder = null;

function startRecording(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  recorder.onstop = () => {
    stream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  recorder.ondataavailable = (event) => {
    let recordedBlob = event.data;
    let url = URL.createObjectURL(recordedBlob);

    let a = document.createElement("a");

    a.style.display = "none";
    a.href = url;
    a.download = "demo-recording.webm";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message.action === "startRecording" &&
    (!recorder || recorder.state !== "recording")
  ) {
    console.log("Started Recording");

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        sendResponse(`processing: ${message.action}`);
        startRecording(stream);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (message.action === "stopRecording") {
    sendResponse(`processing: ${message.action}`);
    if (!recorder) return console.log("no recorder found");
    console.log("stopping video");
    recorder.stop();
  }
});
