export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // 選択されたテキストをフォーマット
    function formatSelectedText() {
      const selection = window.getSelection();

      if (!selection || !selection.toString().trim()) {
        chrome.runtime.sendMessage({
          action: "formatError",
          error:
            "コードが選択されていません。フォーマットしたいコードを選択してください。",
        });
        return;
      }

      formatCode(selection.toString());
    }

    // DOM直接操作でMonaco Editorのテキスト置換
    function replaceInMonacoEditorDOM(formattedCode: string): boolean {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return false;

      try {
        // Monaco Editorのtextareaを探す
        let targetTextarea: HTMLTextAreaElement | null = null;

        // 方法1: 選択範囲からMonaco Editorのtextareaを特定
        const range = selection.getRangeAt(0);
        let container = range.commonAncestorContainer;

        while (
          container &&
          container.nodeType !== Node.ELEMENT_NODE &&
          container.parentNode
        ) {
          container = container.parentNode;
        }

        if (container) {
          const element = container as Element;
          const monacoContainer = element.closest(".monaco-editor");

          if (monacoContainer) {
            targetTextarea = monacoContainer.querySelector(
              "textarea.inputarea",
            ) as HTMLTextAreaElement;
          }
        }

        // 方法2: フォールバック検索
        if (!targetTextarea) {
          const textareas = document.querySelectorAll("textarea.inputarea");
          for (const textarea of textareas) {
            const monacoParent = textarea.closest(
              '.monaco-editor, [class*="monaco"]',
            );
            if (monacoParent) {
              targetTextarea = textarea as HTMLTextAreaElement;
              break;
            }
          }
        }

        if (targetTextarea) {
          // textareaの値とカーソル位置を取得
          const currentValue = targetTextarea.value;
          const selectionStart = targetTextarea.selectionStart;
          const selectionEnd = targetTextarea.selectionEnd;

          // 選択範囲のテキストのみを置換
          const beforeSelection = currentValue.substring(0, selectionStart);
          const afterSelection = currentValue.substring(selectionEnd);
          const newValue = beforeSelection + formattedCode + afterSelection;

          // textareaの値を更新
          targetTextarea.value = newValue;

          // カーソル位置を調整
          const newCursorPosition = selectionStart + formattedCode.length;
          targetTextarea.setSelectionRange(
            newCursorPosition,
            newCursorPosition,
          );

          // イベント発火
          targetTextarea.focus();
          targetTextarea.dispatchEvent(new Event("input", { bubbles: true }));
          targetTextarea.dispatchEvent(new Event("change", { bubbles: true }));

          // 選択をクリア
          selection.removeAllRanges();

          return true;
        }

        return false;
      } catch (error) {
        console.error("DOM直接操作でのエラー:", error);
        return false;
      }
    }

    // コードをフォーマットして選択範囲に適用
    function formatCode(code: string) {
      chrome.runtime.sendMessage(
        { action: "formatCode", code },
        (response: { error?: string; formattedCode?: string }) => {
          if (response.error) {
            chrome.runtime.sendMessage({
              action: "formatError",
              error: response.error,
            });
            return;
          }

          if (response.formattedCode) {
            const success = replaceInMonacoEditorDOM(response.formattedCode);

            chrome.runtime.sendMessage({
              action: success ? "formatSuccess" : "formatError",
              error: success ? undefined : "テキストの置換に失敗しました",
            });
          }
        },
      );
    }

    // メッセージリスナー
    chrome.runtime.onMessage.addListener((request: { action: string }) => {
      if (request.action === "formatCode") {
        formatSelectedText();
      }
    });

    console.log("Code Formatter content script loaded");
  },
});
