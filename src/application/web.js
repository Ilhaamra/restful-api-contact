import express from 'express';
import { publicRouter } from '../routes/public-api.js';
import { errorMiddleware } from '../middlewares/error-middleware.js';
import { userRouter } from '../routes/api.js';
import cookieParser from 'cookie-parser';

export const web = express();

web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(cookieParser());
web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);
