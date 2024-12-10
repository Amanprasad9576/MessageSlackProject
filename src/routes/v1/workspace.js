import express from 'express';

import { createWorkspaceController,
        deleteWorkspaceController,
        getWorkspaceController
 } from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { createWorkspaceSchema } from '../../validators/workspaceSchema.js';
import { validate } from '../../validators/zodValidator.js'; 

const router = express.Router();

router.post('/',
    isAuthenticated,
    validate(createWorkspaceSchema),
    createWorkspaceController);
   

    router.get('/:workspaceId', isAuthenticated, deleteWorkspaceController);

    router.get('/:workspaceId', isAuthenticated, getWorkspaceController);
export default router;
