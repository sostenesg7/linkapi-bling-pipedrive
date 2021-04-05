import mongose from 'mongoose';
import { readFileSync } from 'fs';
import http = require('http');
import https = require('https');
import { logger } from './util/logger';
import { app } from './app';

app.locals.ready = false;

let privateKey;
let certificate;
let ca;

try {
  // TODO: Criar certificados para uso com https
  privateKey = readFileSync('privkey.pem', 'utf8');
  certificate = readFileSync('cert.pem', 'utf8');

  ca = readFileSync('chain.pem', 'utf8');
} catch (reason) {
  logger.error('Error while trying to get certificate information');
}

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined. Observação: A url de conexão do banco foi enviada com o email do reposiório.');
  }

  if (!process.env.LOGGER_LEVEL) {
    throw new Error('LOGGER_LEVEL must be defined');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined');
  }

  try {
    await mongose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    logger.info('Database connection successfull.');

    app.locals.logger = logger;
    app.locals.ready = true;
  } catch (err) {
    logger.log('error', err);
    throw err;
  }
};

const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
  logger.log('info', 'HTTP Server running on port 3000');
});

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(443, () => {
  logger.log('info', 'HTTPS Server running on port 443');
});

start();
