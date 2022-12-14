import got from 'got';

import { ChronosOptions } from '../constants/ChronosOptions';
import { DataType } from '../constants/DataType';
import { WikiEvent, WikiResponse } from '../types/WikiResponse';

import { debug } from '../utils/logger';
import getNextDateValues from '../utils/getNextDateValues';

import processBirths from './processBirths';
import processDeaths from './processDeaths';
import processEvents from './processEvents';

const DATA_URL_TEMPLATE =
  'https://byabbe.se/on-this-day/{month}/{day}/{type}.json';

async function pullDownData(
  dataType: DataType,
  month: number,
  day: number
): Promise<WikiResponse> {
  debug(`Pull down ${dataType} for Month: ${month}, Day: ${day}`);

  if (!dataType || !month || !day) {
    throw new Error(
      `One or more query parameters are missing. T:${dataType};M:${month};D:${day}`
    );
  }

  const targetUrl = DATA_URL_TEMPLATE.replace('{type}', dataType)
    .replace('{month}', month.toString())
    .replace('{day}', day.toString());

  return await got(targetUrl).json();
}

export default async function processor(opts: ChronosOptions) {
  let month = opts.month;
  let day = opts.day;
  let first = true;

  while (first || month !== opts.month || day !== opts.day) {
    const data = await pullDownData(opts.dataType, month, day);
    const args: [number, number, WikiEvent[]] = [
      month,
      day,
      data[opts.dataType]
    ];

    switch (opts.dataType) {
      case 'births':
        processBirths(...args);
        break;
      case 'deaths':
        processDeaths(...args);
        break;
      case 'events':
        processEvents(...args);
        break;

      default:
        throw new Error(
          `No implementation for Mode : ${opts.dataType} was found.`
        );
    }

    // If looping, move to next date values
    if (opts.loop) {
      [month, day] = getNextDateValues(month, day);
    }

    // First record is done, toggle first off.
    first = false;
  }
}
