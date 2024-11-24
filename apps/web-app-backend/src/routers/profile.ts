import { Router, Request, Response } from 'express';
import * as ProfileController from '../controllers/profileController.ts';

export const profileRouter = Router();

profileRouter.get('/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const data = await ProfileController.getProfile(userId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

profileRouter.post('/:userId', async (req: Request, res: Response) => {
  const { value } = req.body || {};
  try {
    const data = await ProfileController.createProfile(value);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

profileRouter.put('/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const updates = req.body;
  try {
    const data = await ProfileController.updateProfile(userId, updates);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

profileRouter.patch('/trip/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const updates = req.body;
  try {
    const data = await ProfileController.updateTrip(userId, updates);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

profileRouter.get('/trip/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const data = await ProfileController.getTrip(userId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
