import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import errorHandler from 'api-error-handler';
import morgan from 'morgan';
import config from 'config';
import cors from 'cors';

import logger from './logger';
import security from './security';
import api from './api';

dotenv.config();

const app = express();
app.server = http.createServer(app);

security(app);

app.use(morgan('combined', { stream: logger.stream }));

app.use(cors());
app.use(express.json());

app.use('/', api);

api.use(errorHandler());

app.server.listen(process.env.PORT || config.get('port'), () => {
  logger.info(`Started on port ${app.server.address().port}`);
});

export default app;
