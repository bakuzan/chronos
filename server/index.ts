import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';

import {
  getBirthsForDate,
  getDeathsForDate,
  getEventById,
  getEventsForDate
} from './service';
import { getDateForRequest, getOrdinalSuffix } from './utils';
import { monthNames } from './constants';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoints
app.get('/', (req: Request, res: Response) => {
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
});

app.get('/event/:id', (req: Request, res: Response) => {
  const backUrl = req.headers.referer ?? '/';
  const item = getEventById(req.params.id);

  if (!item) {
    res.render('404', {
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
});

// Start the server...
app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
