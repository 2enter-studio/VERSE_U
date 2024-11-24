import { Router } from 'express';
import { authRouter } from './auth';
import { profileRouter } from './profile';
import { chatRouter } from './chat';
import { wearingRouter } from './wearing';
import { systemRouter } from './system';
import { storageRouter } from './storage';

export const router = Router();
router.use('/api/auth', authRouter);
router.use('/api/profile', profileRouter);
router.use('/api/chats', chatRouter);
router.use('/api/wearings', wearingRouter);
router.use('/api/system', systemRouter);
router.use('/api/storage', storageRouter);
