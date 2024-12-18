import express from 'express';
import { getMessage } from '../../controllers/messageController';
import { isAuthenticated } from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/messages/:channelId',isAuthenticated,getMessage);

export default router;

// router for message 