# ドキュメント作成ツール docusaurus-init

こんなドキュメントサイトが作れる:  
https://docusaurus.io/en/


## 導入方法
```bash
yarn add -D docusaurus-init
yarn docusaurus-init
```

## こんなフォルダが作られる

```
root-directory
├── docs-examples-from-docusaurus
│   ├── doc1.md
│   ├── doc2.md
│   ├── doc3.md
│   ├── exampledoc4.md
│   └── exampledoc5.md
└── website
    ├── blog-examples-from-docusaurus
    │   ├── 2016-03-11-blog-post.md
    │   ├── 2017-04-10-blog-post-two.md
    │   ├── 2017-09-25-testing-rss.md
    │   ├── 2017-09-26-adding-rss.md
    │   └── 2017-10-24-new-version-1.0.0.md
    ├── core
    │   └── Footer.js
    ├── package.json
    ├── pages
    ├── sidebars.json
    ├── siteConfig.js
    └── static
```

## その後やること
- 生成された`docs-examples-from-docusaurus`を`docs`にリネームする。
- `cd website`
- `blog-examples-from-docusaurus`を`blog`にリネーム
- `yarn start`する
- `localhost:3000`にアクセスする

