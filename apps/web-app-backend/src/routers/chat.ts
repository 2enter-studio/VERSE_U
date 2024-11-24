import { Router, Request, Response } from 'express';
import * as ChatController from '../controllers/chatController.ts';

export const chatRouter = Router();

chatRouter.get('/chats/:userId', async (req: Request, res: Response) => {
  const { userId, chatIds } = req.query || {};
  try {
    let data;
    if (chatIds) {
      data = await ChatController.fetchChats(userId, chatIds);
    } else {
      data = await ChatController.fetchUserChats(userId);
    }
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

chatRouter.get('/chats/:userId/messages', async (req: Request, res: Response) => {
  const { userId, chatId } = req.query || {};
  try {
    const data = await ChatController.fetchChatMessages(chatId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

chatRouter.post('/chats/:chatId/messages', async (req: Request, res: Response) => {
  const { chatId, content, sender } = req.body || {};
  try {
    const data = await ChatController.postMessage(chatId, content, sender);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
