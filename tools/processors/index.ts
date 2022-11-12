import got from 'got';
import { hasUncaughtExceptionCaptureCallback } from 'process';

import { ChronosOptions } from '../constants/ChronosOptions';
import { DataType } from '../constants/DataType';
import { WikiResponse } from '../types/WikiResponse';

import { debug } from '../utils/logger';

import processEvents from './processEvents';

const DATA_URL_TEMPLATE =
  'https://byabbe.se/on-this-day/{month}/{day}/{type}.json';

async function pullDownData(dataType: DataType, month: number, day: number) {
  debug(`Pull down ${dataType} for Month:${month}, Day:${day}`);

  if (!dataType || !month || !day) {
    throw new Error(
      `One or more query parameters are missing. T:${dataType};M:${month};D:${day}`
    );
  }

  const targetUrl = DATA_URL_TEMPLATE.replace('{type}', dataType)
    .replace('{month}', month.toString())
    .replace('{day}', day.toString());

  const response = await got(targetUrl).json();
  return response as WikiResponse;
}

export default async function processor(opts: ChronosOptions) {
  const data = await pullDownData(opts.dataType, opts.month, opts.day);

  switch (opts.dataType) {
    case 'events':
      processEvents(opts, data);
      break;
    default:
      throw new Error(
        `No implementation for Mode : ${opts.dataType} was found.`
      );
  }
}
