# cloudmama

機械学習で生活習慣改善を支援するAIカメラ。
一人暮らしの大学生・社会人の生活を指導する目でありたい。

Maker Faire Tokyo 2023 (10/14-15 @ビッグサイト) に出展予定。
5月11日（木）～出展作品の受付が始まるので準備を進めている。

## 紹介動画と紹介記事

[記事: ステイホームで乱れた生活習慣を機械学習を使って改善する話 #kuac2020](https://qiita.com/lzpel/items/e25633684128cebec6b8)

[動画: Maker Faire Tokyo 2023 出展作品紹介 規則正しい生活を支援するAIカメラ cloudmama](https://vimeo.com/803534490)

<iframe src="https://player.vimeo.com/video/803534490?h=1a34f061ab" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
<p><a href="https://vimeo.com/803534490">Maker Faire Tokyo 2023 出展作品紹介 規則正しい生活を支援するAIカメラ cloudmama</a> from <a href="https://vimeo.com/user195615177">三角聡</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

## 作り方

1. [3dmodel/package.stl](./3dmodel/package.stl)を3Dプリンターで印刷します
2. [PCB/LZP32-SPEAKER_(最新版)](./PCB)をPCB製造業者（例えばSeeeds Fusion, PCBWAY）などで製造してもらいます。
    - BOMに従い部品も実装してください
3. スピーカー（F02607H0）（[秋月電子](https://akizukidenshi.com/catalog/g/gP-10366/)）を購入してください
    - これでなくとも大抵の8ohmスピーカーに対応しています、別のスピーカーを用いる場合は自分で外装を設計してください。
4. スピーカーの+/-を発注した基盤の+/-にスクリューターミナルを用いて接続してください。
6. USB給電すれば動作します。
7. Wifiから設定画面に接続します。
    - TODO: 以下完成させる、プロトタイピングとしては動くが配布できる状態ではない

## 開発ノウハウ

- esp-idf5.0のwindows版 をインストールして組み込みプログラミングを行う
  - docker image版の開発環境は仮想環境からUSBを経由してボードに書き込めないので使えない
- スピーカーと接続する screw terminal の部品選定について
  - KF350-3.5-2P  採用
  - DB125-3.5-2P-GN-S　　不採用　在庫が少ないので依存するのは良くない
- Fusion360による基板設計での頻出問題と解決法
  - 部品の3Dモデルが反映されない
    - 3Dモデルにstlを使っている->体積を持たないので使えません（警告マークが出ているはずです）STEPファイルを使いましょう
    - STEPファイルを読み込めない->メッシュとしては読み込めません->Teamの一ファイルとしてアップロードし、それを外部コンポーネントとして挿入しましょう（ドラッグアンドドロップ）
    - 3Dモデルが更新されていない->基盤デザインで「ライブラリからデザインを更新」をクリック、「デザインで使用されている全てのライブラリからデザインを更新」ボタンは効果がない->3DPCBにプッシュ

## License

MIT Copyright 2020 lzpel
