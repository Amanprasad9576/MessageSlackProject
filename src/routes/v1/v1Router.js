import express from 'express';

import userRouter from './users.js';
import  workspaceRouter from './workspace.js';
import channelRouter from './channel.js';

const router = express.Router();

router.use('/users', userRouter);

router.use('/workspace',workspaceRouter);

router.use('/channel',channelRouter);

export default router;