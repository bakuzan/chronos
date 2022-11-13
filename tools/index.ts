#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import { Option, program } from 'commander';

import { ChronosOptions } from './constants/ChronosOptions';
import processor from './processors';

import { debug } from './utils/logger';
import { myParseInt, myParseDataType } from './utils/optionParsers';

async function run() {
  console.log(
    chalk.green(
      figlet.textSync(`Chronos`, {
        horizontalLayout: 'full',
        width: process.stdout.columns,
        whitespaceBreak: true
      })
    )
  );

  program
    .version('0.0.1')
    .description('Pull wikipedia data')
    .addOption(
      new Option(
        '-t, --dataType <dataType>',
        `Data type to pull down`
      ).argParser(myParseDataType)
    )
    .option('-m, --month <month>', `Month of data to pull`, myParseInt)
    .option('-d, --day <day>', `Day of data to pull`, myParseInt)
    .option('-l, --loop', `Loop through days for a year`, false)
    .parse(process.argv);

  const options = program.opts() as ChronosOptions;
  debug('Starting with Options: ', options);

  await processor(options);

  debug(`Process Complete.`);
}

run();
