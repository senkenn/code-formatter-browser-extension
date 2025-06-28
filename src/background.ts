import { formatCode } from "./formatter";

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Code Formatter Browser Extension installed");
});

// Listen for keyboard commands
chrome.commands.onCommand.addListener(async (command: string) => {
  if (command === "format-code") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: "formatCode" });
    }
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(
  (
    request: any,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
  ) => {
    if (request.action === "formatCode") {
      formatCode(request.code)
        .then((formattedCode: string) => {
          sendResponse({ formattedCode });
        })
        .catch((error: Error) => {
          sendResponse({ error: error.message });
        });
      return true; // Indicates that the response will be sent asynchronously
    }
  },
);
