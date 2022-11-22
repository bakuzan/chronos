import { Request, Response } from 'express';

import {
  getBirthsForDate,
  getDeathsForDate,
  getEventsForDate
} from './service';
import { monthNames } from './constants';
import { getDateForRequest, getOrdinalSuffix } from './utils';

import { EventItemWithRelatedLinks } from './types/EventItemWithRelatedLinks';

export function homePageHandler(req: Request, res: Response) {
  const model = getDateForRequest(req.query);
  const date = model.date;

  const day = date.getDate();
  const dateWithOrd = getOrdinalSuffix(day);
  const monthIndex = date.getMonth();
  const monthName = monthNames[monthIndex];
  const month = monthIndex + 1;

  const births = getBirthsForDate(month, day);
  const deaths = getDeathsForDate(month, day);
  const events = getEventsForDate(month, day);

  res.render('index', {
    title: 'On this day',
    header: `On ${dateWithOrd} ${monthName}`,
    message: model.message,
    day,
    month,
    births,
    deaths,
    events
  });
}

export function createSingleEventHandler(
  getFunc: (id: string | undefined) => EventItemWithRelatedLinks | null
) {
  return (req: Request, res: Response) => {
    const backUrl = req.headers.referer ?? '/';
    const item = getFunc(req.params.id);

    if (!item) {
      res.render('404', {
        title: `404`,
        message: `History event could not be found.`,
        backUrl
      });
      return;
    }

    const dateWithOrd = getOrdinalSuffix(item.day);
    const monthIndex = item.month - 1;
    const monthName = monthNames[monthIndex];

    res.render('event', {
      title: item.description,
      header: `On ${dateWithOrd} ${monthName} ${item.year}`,
      item,
      backUrl
    });
  };
}
