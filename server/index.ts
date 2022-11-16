import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';

import { getEventsForDate } from './service';
import { getOrdinalSuffix } from './utils';
import { monthNames } from './constants';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoints
app.get('/', (req: Request, res: Response) => {
  const today = new Date();
  const date = today.getDate();
  const dateWithOrd = getOrdinalSuffix(date);
  const monthIndex = today.getMonth();
  const monthName = monthNames[monthIndex];

  const events = getEventsForDate(monthIndex + 1, date);

  res.render('index', {
    title: 'On this day',
    header: `On ${dateWithOrd} ${monthName}`,
    events
  });
});

// Start the server...
app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
