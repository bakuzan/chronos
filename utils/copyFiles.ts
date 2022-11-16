import fse from 'fs-extra';
import path from 'path';
import util from 'util';
import chalk from 'chalk';

const copyDirAsync = util.promisify(fse.copy);

const projectRoot = path.resolve(__dirname, '../server');
const buildFolder = path.resolve(__dirname, '../dist');

async function copyDir(folderName: string) {
  await copyDirAsync(
    path.resolve(projectRoot, folderName),
    path.resolve(buildFolder, folderName)
  );

  console.log(
    chalk.magenta(
      `Copied ${projectRoot}\\${folderName} to ${buildFolder}\\${folderName}`
    )
  );
}

async function run() {
  if (!fse.existsSync(buildFolder)) {
    console.log(chalk.red(`${buildFolder} does not exist!`));
    process.exit(0);
  }

  await copyDir('public');
  await copyDir('views');
}

run();
