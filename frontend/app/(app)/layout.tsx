//- background.jpgを背景に、SignInUpコンポーネントを中央に配置
//- グラスモーフィズムなデザインでプレミアム感を演出
//ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//- stateless_ui/以下のTsxは外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止、またexport function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上のルールは保持し以降に内容を実装して