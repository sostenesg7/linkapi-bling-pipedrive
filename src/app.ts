import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { json } from 'body-parser';
import { loggerWrite } from './util';
import { errorHandler } from './middlewares';
import apiRouter from './routes';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV != 'development') {
  app.use(morgan(process.env.LOGGER_LEVEL as string, { stream: loggerWrite }));
}

app.use('/api', apiRouter);

app.all('*', async (req, res) => {
  try {
    res.status(404).send('Endereço não encontrado.');
  } catch (reason) {}
});

app.use(errorHandler);

export { app };
