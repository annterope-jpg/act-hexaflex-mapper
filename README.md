# ACT Hexaflex Mapper

ACT（アクセプタンス＆コミットメント・セラピー）の6つのプロセスを手がかりに、観察内容とケースフォーミュレーション上の仮説を整理するためのオープンソース・プロトタイプです。

## 現在の機能

- 利用目的、限界、匿名化に関する利用前確認
- ACTの6つのプロセスの概要表示
- 匿名ケース概要の一時入力
- 本人の言葉、観察事実、支援者の仮説、望む変化の区分
- 6つのACTプロセスごとの観察・仮説マッピング
- 関連して検討するプロセスの複数選択
- 価値、最小の一歩、障壁、支援、振り返り時期を分けた行動計画
- 入力中の内容を読み取り専用で確認できる、ブラウザ印刷用のケースまとめ
- HTML・CSS・JavaScriptだけで動作
- AI、外部API、外部通信を使用しないローカル構成

現段階では匿名・架空ケースだけを対象とします。入力内容はブラウザを閉じたり再読み込みしたりすると失われ、端末には保存されません。診断、緊急性の判断、治療方針の自動決定には使用しません。また、端末内で動作することだけでは、HIPAAを含む法令や組織基準への準拠は保証されません。

## 起動方法

1. このリポジトリをダウンロードまたはクローンします。
2. `index.html` を対応ブラウザで開きます。
3. 利用前確認を読み、同意欄を選択して開始します。

ビルド、パッケージのインストール、Webサーバーは不要です。

## ファイル構成

- `index.html`：画面の構造と利用前確認
- `styles.css`：画面デザインとレスポンシブ対応
- `app.js`：画面遷移、入力確認、プロセス表示の制御
- `data_hints.js`：ACTプロセスとモデル事例のコンテンツ

## 開発方針

- 自動診断や未検証のスコアを提供しない
- 観察事実、本人の言葉、支援者の仮説を区別する
- 本人との共同検討を中心にする
- 実在ケースを扱う前に、別途プライバシー・セキュリティ・運用面を審査する

## English summary

ACT Hexaflex Mapper is a client-side prototype for organizing observations and case-formulation hypotheses using the six ACT processes. It currently provides a pre-use safety notice and a read-only overview of the six processes. It does not provide diagnosis or automated treatment recommendations, and the current version is limited to anonymous or fictional cases.
