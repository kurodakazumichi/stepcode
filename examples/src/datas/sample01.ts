const datas = [
//-----------------------------------------------------------------------------
"StepCodeでHTMLの基本の形を学ぶ1",
``,
`
**StepCode**というツールを作ってみたよ
これを使ってHTMLの基本を説明してみるよ
`,
//-----------------------------------------------------------------------------
"StepCodeでHTMLの基本の形を学ぶ2",
`<!DOCTYPE html>`,
`
HTMLファイルを作ったらまずこの１行を書く。

これは**このファイルはHTML5で書いてますから！**
という宣言をしているよ
`,
//-----------------------------------------------------------------------------
"StepCodeでHTMLの基本の形を学ぶ3",
`<!DOCTYPE html>`,
`
**宣言**とかよくわからんと思うけど、とりあえずそんなもんってことにしておいて

それよりもまず最初に**タグ**というもの覚えましょ
`,
//-----------------------------------------------------------------------------
"StepCodeでHTMLの基本の形を学ぶ4",
`<!DOCTYPE html>
<html></html>`,
`
HTMLでは「<」と「>」で囲ってあるやつを**タグ**と呼ぶよ
タグには開始と終了があって

<html>：こっちを**開始タグ**
</html>：こっちは**終了タグ**とか**閉じタグ**っていうね
`,
//-----------------------------------------------------------------------------
"StepCodeでHTMLの基本の形を学ぶ5",
`<!DOCTYPE html>
<html>


</html>`,
`**開始タグ**と**閉じタグ**の間にhtmlを書いていくよ
改行も自由にしておっけーよ`,
//-----------------------------------------------------------------------------
"StepCodeでHTMLの基本の形を学ぶ6",
`<!DOCTYPE html>
<html>


</html>`,
`ってな感じでコードをステップで学べるツール
StepCodeでした。`,
]; 

export default {
  title    :"index.html",
  contents :datas
}