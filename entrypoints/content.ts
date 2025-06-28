export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // TypeScript コードを検出してフォーマットするコンテンツスクリプト

    // 選択されたテキストをフォーマット
    function formatSelectedText() {
      const selection = window.getSelection();

      if (!selection || !selection.toString().trim()) {
        console.log("フォーマット対象のコードが選択されていません");
        // ポップアップにエラーメッセージを送信
        chrome.runtime.sendMessage({
          action: "formatError",
          error:
            "コードが選択されていません。フォーマットしたいコードを選択してください。",
        });
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
        (response: { error?: string; formattedCode?: string }) => {
          if (response.error) {
            console.error("フォーマットエラー:", response.error);
            // ポップアップにエラーメッセージを送信
            chrome.runtime.sendMessage({
              action: "formatError",
              error: response.error,
            });
            return;
          }

          const formattedCode = response.formattedCode;
          console.debug("Formatted code:", formattedCode);

          // 選択されたテキストを置換
          try {
            const range = selection.getRangeAt(0);

            // 直接範囲のテキストコンテンツを置換
            range.deleteContents();
            range.insertNode(document.createTextNode(formattedCode || ""));

            // 選択をクリア
            selection.removeAllRanges();

            // ポップアップに成功メッセージを送信
            chrome.runtime.sendMessage({
              action: "formatSuccess",
            });
          } catch (error) {
            console.error("テキスト置換エラー:", error);
            // ポップアップにエラーメッセージを送信
            chrome.runtime.sendMessage({
              action: "formatError",
              error: "テキストの置換中にエラーが発生しました",
            });
          }

          console.log("コードをフォーマットしました");
        },
      );
    }

    // メッセージリスナー
    chrome.runtime.onMessage.addListener(
      (
        request: { action: string },
        _sender: chrome.runtime.MessageSender,
        _sendResponse: (response?: unknown) => void,
      ) => {
        if (request.action === "formatCode") {
          formatSelectedText();
        }
      },
    );

    console.log("Code Formatter content script loaded");
  },
});
