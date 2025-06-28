// TypeScript コードを検出してフォーマットするコンテンツスクリプト

// 選択されたテキストをフォーマット
function formatSelectedText() {
  const selection = window.getSelection();

  if (!selection || !selection.toString().trim()) {
    console.log("フォーマット対象のコードが選択されていません");
    return;
  }

  const selectedText = selection.toString();
  formatCode(selectedText, selection);
}

// コードをフォーマットして選択範囲に適用
function formatCode(code: string, selection: Selection) {
  chrome.runtime.sendMessage(
    {
      action: "formatCode",
      code: code,
    },
    (response: any) => {
      if (response.error) {
        console.error("フォーマットエラー:", response.error);
        return;
      }

      const formattedCode = response.formattedCode;

      // 選択されたテキストを置換
      try {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(formattedCode));
      } catch (error) {
        console.error("テキスト置換エラー:", error);
      }

      console.log("コードをフォーマットしました");
    },
  );
}

// メッセージリスナー
chrome.runtime.onMessage.addListener(
  (
    request: any,
    _sender: chrome.runtime.MessageSender,
    _sendResponse: (response?: any) => void,
  ) => {
    if (request.action === "formatCode") {
      formatSelectedText();
    }
  },
);

// ページ読み込み時の初期化
document.addEventListener("DOMContentLoaded", () => {
  console.log("Code Formatter Extension: Content script loaded");
});
