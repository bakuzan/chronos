import path from 'path';
import fs from 'fs';

const targetFolder = 'tools/database/scripts';

export function readSQLFiles() {
  try {
    const filenames = fs.readdirSync(targetFolder);

    return filenames
      .filter((x) => x.endsWith('sql'))
      .map((filename) => {
        const content = fs.readFileSync(
          path.join(targetFolder, filename),
          'utf-8'
        );

        return {
          number: Number(filename.split('.')[0]),
          name: filename,
          script: content.toString()
        };
      });
  } catch (err) {
    console.log(err);
    throw new Error(`Failed to read SQL files`);
  }
}

export default function setupExecution() {
  return readSQLFiles().sort((a, b) => a.number - b.number);
}
