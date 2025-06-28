// ポップアップのロジック - ユーザーインタラクションと情報表示

document.addEventListener("DOMContentLoaded", () => {
  const formatButton = document.getElementById("formatButton");
  const statusDiv = document.getElementById("status");

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

          setTimeout(() => {
            updateStatus(
              "フォーマット完了！Shift+Alt+Fでも実行できます",
              "success",
            );
          }, 1000);
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
