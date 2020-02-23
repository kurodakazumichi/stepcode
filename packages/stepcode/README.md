# StepCode

## install
```
yarn add @puyan/stepcode
```

## How to use

### Step 1
プレースフォルダーとなるHTMLElementを用意する

```html
<div id="stepcode"></div>
```

### Step2
StepCodeをimportしたらnewする。
第一引数にプレースホルダーとなるHTMLElement(もしくはセレクタ)
第二引数にStepCodeのJSONデータを指定する。

```js
import StepCode from '@puyan/stepcode';

new StepCode(
  document.getElementById("stepcode"),
  {}
):
```