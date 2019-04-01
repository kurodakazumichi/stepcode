/**
 * Scriptで使用するユーティリティを定義する
 */
const fs = require('fs');
const path = require('path');

/**
 * packagesディレクトリのパス
 */
const PACKAGES_DIR = path.resolve(__dirname, '../packages');

/**
 * packages/* 配下のすべてのディレクトリの絶対パスを取得する  
 */
module.exports.getPackages = function getPackages() {
  return fs
    .readdirSync(PACKAGES_DIR)
    .map(file => path.resolve(PACKAGES_DIR, file))
    .filter(f => fs.lstatSync(path.resolve(f)).isDirectory());
};