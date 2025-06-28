import { formatCode } from "../lib/formatter";

export default defineBackground(() => {
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
      request: { action: string; code?: string },
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response?: {
        formattedCode?: string;
        error?: string;
      }) => void,
    ) => {
      if (request.action === "formatCode" && request.code) {
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
});
