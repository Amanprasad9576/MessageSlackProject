import express from 'express';

import { signIn, signUp } from '../../controllers/userController.js';
import { userSignInSchema,userSignUpSchema } from '../../validators/userSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.get('/',(req,res)=>{
    return res.status(200).json({message:'get all user'});
});

router.post('/signUp',validate(userSignUpSchema),signUp);

router.post('/signIn',validate(userSignInSchema),signIn);

export default router;