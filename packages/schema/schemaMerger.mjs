// @ts-check
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function mergeSchemas() {
  // スキーマファイルが置かれているディレクトリを指定
  const typesArray = loadFilesSync(path.join(__dirname, 'graphql'), {
    extensions: ['graphql'],
  });

  // スキーマをマージ
  const mergedTypeDefs = mergeTypeDefs(typesArray);

  // マージされたスキーマを文字列として取得
  const printedTypeDefs = print(mergedTypeDefs);

  // 結果をファイルに書き込む
  fs.writeFileSync(
    path.join(__dirname, 'graphql/dist/schema.graphql'),
    printedTypeDefs
  );
}

mergeSchemas().then(() => console.log('スキーマが正常にマージされました。'));
