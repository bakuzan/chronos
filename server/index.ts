import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';

import { createSingleEventHandler, homePageHandler } from './api';
import { getBirthById, getDeathById, getEventById } from './service';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoints
app.get('/', homePageHandler);
app.get('/event/:id', createSingleEventHandler(getEventById));
app.get('/birth/:id', createSingleEventHandler(getBirthById));
app.get('/death/:id', createSingleEventHandler(getDeathById));

// Start the server...
app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
