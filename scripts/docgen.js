'use strict';
/******************************************************************************
 * ドキュメント生成スクリプト
 * 
 * ドキュメント生成にはtypedocを利用している。
 * 
 * - ドキュメント対象
 * ./packages/*
 * 
 * - 実行方法
 * node docgen.js [package name]
 * 
 * `node docgen.js`
 * ./packages/配下のすべてのプロジェクトのドキュメントを生成します。
 * 
 * `node docgen.js stepcode`
 * [package name]で指定したプロジェクトのみ、ドキュメントを生成します。
 *****************************************************************************/
// 利用ライブラリ読み込み
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const { getPackages } = require('./utils');

// ドキュメント出力先のディレクトリパス
const DOC_DIR = path.resolve('./typedocs');

// パッケージの配列
const packages = getPackages();

// コマンドライン引数を取得
const specifieds = process.argv.slice(2);

/**
 * パッケージ生成をスキップするかどうか判定する
 * 引数にパッケージの指定がある場合
 * 指定されていないパッケージは全てスキップする
 * @param {*} createName 生成するパッケージの名前
 */
const isSkipGenerate = (createName) => 
{
  // 引数指定がなければスキップの必要性はない
  if (specifieds.length <= 0) return false;

  // 生成するパッケージと指定されたパッケージが一致する場合はスキップしない
  if (specifieds.indexOf(createName) !== -1) return false;

  // その他のケースはスキップする
  return true;
}

// ドキュメント生成
packages.map((p) => 
{
  // パッケージのベースディレクトリ名を取得
  const _basename = path.basename(p);

  // 引数が指定されている場合、指定されたパッケージ以外はスキップする処理
  if (isSkipGenerate(_basename)){
    console.log(chalk.blue(`Skip ${_basename}`));
    return;
  } 

  // 生成するドキュメントの情報を定義
  const srcdir   = path.resolve(p, 'src');
  const outdir   = path.resolve(DOC_DIR, _basename);
  const tsconfig = path.resolve(p, "tsconfig.json");

  // tsconfig.jsonの存在確認
  if(!fs.existsSync(tsconfig)) {
    console.log(chalk.red(`${tsconfig} not found.`));
    return;
  }

  // コマンドを定義(yarn typedoc --out [outdir] [srcdir] --tsconfig [tsconfig path])
  const command = [
    'yarn',
    'typedoc',
    `--out ${outdir}`,
    srcdir,
    `--tsconfig ${tsconfig}`
  ].join(' ');


  // ドキュメント生成開始
  console.log(chalk.inverse.green(`Start build documentation of ${_basename}`));

  try{
    execa.shellSync(command);
    console.log(chalk.green('Success'));
  } catch(e) {
    console.log(chalk.red(`ERROR:${e.stderr}`));
    console.log(chalk.inverse('エラーになったコマンド:') + `\n${e.cmd}\n`);
  }
  
})