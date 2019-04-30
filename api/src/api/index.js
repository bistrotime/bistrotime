import { Router } from 'express';
import bar from './bar';
import platform from './platform';

const api = Router();

api.use('/platform', platform);
api.use('/bar', bar);

export default api;
