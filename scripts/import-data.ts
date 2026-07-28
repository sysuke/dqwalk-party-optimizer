/**
 * ゲームデータインポートスクリプト
 *
 * 使い方:
 *   npm run import:data -- --file path/to/data.json
 *
 * 注意: 9db（みんドラ）等の攻略サイトは利用規約で
 * プログラムによるデータ取得（スクレイピング）を禁止しています。
 * このスクリプトはユーザーが手動で作成・取得した JSON の取り込み専用です。
 */

import fs from "node:fs";
import path from "node:path";

const IMPORT_DIR = path.join(process.cwd(), "data", "imported");

function main() {
  const args = process.argv.slice(2);
  const fileIndex = args.indexOf("--file");

  if (fileIndex === -1 || !args[fileIndex + 1]) {
    console.error("Usage: npm run import:data -- --file <path-to-json>");
    process.exit(1);
  }

  const sourcePath = path.resolve(args[fileIndex + 1]);

  if (!fs.existsSync(sourcePath)) {
    console.error(`File not found: ${sourcePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(sourcePath, "utf-8");
  const data = JSON.parse(raw);

  if (!data.equipment && !data.hearts && !data.monsters && !data.skills) {
    console.error(
      "Invalid format. JSON must contain at least one of: equipment, hearts, monsters, skills",
    );
    process.exit(1);
  }

  fs.mkdirSync(IMPORT_DIR, { recursive: true });
  const destName = path.basename(sourcePath);
  const destPath = path.join(IMPORT_DIR, destName);

  fs.copyFileSync(sourcePath, destPath);
  console.log(`Imported to ${destPath}`);
}

main();
