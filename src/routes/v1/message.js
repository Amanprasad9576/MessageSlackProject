import express from 'express';

import { getMessage } from '../../controllers/messageController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/messages/:channelId',isAuthenticated,getMessage);

export default router;

// router for message 