import express from 'express';

import { signIn, signUp } from '../../controllers/userController.js';


const router = express.Router();

router.get('/',(req,res)=>{
    return res.status(200).json({message:'get all user'});
});

router.post('/signUp',signUp);

router.post('/signIn',signIn);

export default router;