# StepCode

## ローカル npm registryの設定

```bash
# verdaccioを入れてなければインストールする
yarn global add verdaccio
```

```bash
# verdaccioを起動する
verdaccio
# http://localhost:4873でnpm registry serverが起動する
```

```bash
# publish
cd [publishするパッケージのあるフォルダ]
npm publish --registry http://localhost:4873

# unpublish
npm unpublish --force [削除するパッケージ]
```

毎回`--registry http://localhost:4873`がめんどくさい場合は

```bash
# npm configにローカルのregistryをセットしておく
npm config set registry http://localhost:4873

# これでpublishはこれでできる
npm publish

# unpublishも
npm unpublish --force [削除するパッケージ]
```
