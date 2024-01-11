const videoContainer = document.createElement("div");

const createVideoContainer = (userStream) => {
  videoContainer.id = "video-container";
  videoContainer.style.position = "fixed";
  videoContainer.style.display = "inline";
  videoContainer.style.top = "10px";
  videoContainer.style.right = "10px";
  videoContainer.style.zIndex = "9999";
  videoContainer.style.overflow = "hidden";

  const videoPreview = document.createElement("video");
  videoPreview.width = 200;
  videoPreview.height = 200;
  videoPreview.style.objectFit = "cover";
  videoPreview.style.borderRadius = "50%";
  videoPreview.autoplay = true;
  videoPreview.playsinline = true;
  videoPreview.srcObject = userStream;

  videoContainer.appendChild(videoPreview);
  document.body.appendChild(videoContainer);

  let vdElm = document.getElementById("video-container");

  let newPosX = 0,
    newPosY = 0,
    startPosX = 0,
    startPosY = 0;

  vdElm.addEventListener("mousedown", function (e) {
    e.preventDefault();

    startPosX = e.clientX;
    startPosY = e.clientY;

    document.addEventListener("mousemove", mouseMove);

    document.addEventListener("mouseup", function () {
      document.removeEventListener("mousemove", mouseMove);
    });
  });

  function mouseMove(e) {
    newPosX = startPosX - e.clientX;
    newPosY = startPosY - e.clientY;

    startPosX = e.clientX;
    startPosY = e.clientY;

    vdElm.style.top = vdElm.offsetTop - newPosY + "px";
    vdElm.style.left = vdElm.offsetLeft - newPosX + "px";
  }
};

const removeVideoContainer = () => {
  videoContainer.removeChild(videoContainer.firstChild);
  videoContainer.remove();
  console.log("The video container is removed");
};
