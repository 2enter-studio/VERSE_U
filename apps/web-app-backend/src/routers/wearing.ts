import { Router, Request, Response } from 'express';
import * as WearingController from '../controllers/wearingController.ts';

export const wearingRouter = Router();

wearingRouter.get('/user/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const data = await WearingController.fetchUserWearings(userId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

wearingRouter.put('/update-wearing-status/:wearingId', async (req: Request, res: Response) => {
  const wearingId = req.params.wearingId;
  const { userId, equipped } = req.body || {};
  try {
    const data = await WearingController.updateWearingStatus(wearingId, userId, equipped);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

wearingRouter.get('/meshes', async (req: Request, res: Response) => {
  try {
    const data = await WearingController.getMeshes();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

wearingRouter.get('/wearings', async (req: Request, res: Response) => {
  try {
    const data = await WearingController.getWearings();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

wearingRouter.get('/owned-wearings/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const data = await WearingController.getOwnedWearings(userId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

wearingRouter.post('/owned-wearings/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const data = await WearingController.insertOwnedWearings(userId, req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

wearingRouter.get('/starter-pack', async (req: Request, res: Response) => {
  try {
    const data = await WearingController.getStarterPack();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

wearingRouter.post('/owned-wearings/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const data = await WearingController.insertStarterPack(req.body, userId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

wearingRouter.post('/equip-wearings/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { wearingIds } = req.body || {};
  try {
    const data = await WearingController.equipWearings(userId, wearingIds);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

wearingRouter.post('/unequip-wearings/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { wearingIds } = req.body || {};
  try {
    const data = await WearingController.unequipWearings(userId, wearingIds);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
