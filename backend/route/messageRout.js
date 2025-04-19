import express from 'express';
import {sendMessage,getMessage}  from '../routeController/messageroutecontroller.js';
import  isLogin  from '../middleware/isLogin.js';

const router = express.Router();

router.post('/send/:id',isLogin,sendMessage)
router.get('/:id',isLogin,getMessage)

export default router;