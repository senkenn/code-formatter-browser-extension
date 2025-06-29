# Code Formatter Browser Extension

TypeScript Playground用のコードフォーマッタ拡張機能です。

## テスト

### 全てのテストを実行

```bash
pnpm test
```

### ユニットテスト（vitest）

```bash
# 一回実行
pnpm test:unit

# ウォッチモード
pnpm test:unit:watch

# UI付きモード
pnpm test:unit:ui
```

### E2Eテスト（Playwright）

```bash
# ヘッドレスモードで実行
pnpm test:e2e

# ブラウザを開いて実行
pnpm test:e2e:headed
```

E2EテストはPlaywrightを使用してTypeScript Playgroundでの実際のフォーマット動作をテストします。

## 開発

```bash
# 開発モード
pnpm dev

# ビルド
pnpm build
```
