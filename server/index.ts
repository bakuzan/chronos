import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoints
app.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Chronos', message: 'Express+Pug' });
});

// Start the server...
app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
