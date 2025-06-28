// ポップアップのロジック - ユーザーインタラクションと情報表示

document.addEventListener("DOMContentLoaded", () => {
  const formatButton = document.getElementById("formatButton");
  const statusDiv = document.getElementById("status");

  // content scriptからのメッセージリスナー
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "formatError") {
      updateStatus(message.error, "error");
    } else if (message.action === "formatSuccess") {
      updateStatus("フォーマット完了！", "success");
    }
  });

  if (formatButton) {
    formatButton.addEventListener("click", async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { action: "formatCode" });
          updateStatus("コードをフォーマットしています...", "info");
        }
      } catch (error) {
        updateStatus("エラーが発生しました", "error");
        console.error("Error:", error);
      }
    });
  }

  function updateStatus(message: string, type: "info" | "success" | "error") {
    if (statusDiv) {
      statusDiv.textContent = message;
      statusDiv.className = `status ${type}`;
    }
  }

  // 初期ステータス表示
  updateStatus("Shift+Alt+F でコードをフォーマット", "info");
});
