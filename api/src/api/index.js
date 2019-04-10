import { Router } from 'express';
import finder from './finder';
import platform from './platform';

const api = Router();

api.use('/platform', platform);
api.use('/finder', finder);

export default api;
