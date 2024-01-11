chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "createTab") {
    chrome.tabs.create({ url: message.url });
  }
});
