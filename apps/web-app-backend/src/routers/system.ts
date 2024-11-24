import { Router, Request, Response } from 'express';
import * as SystemController from '../controllers/systemController.ts';

export const systemRouter = Router();

systemRouter.get('/maintenance', async (req: Request, res: Response) => {
  console.log('get maintenance');
  try {
    const data = await SystemController.getMaintenance();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

systemRouter.get('/app-version', async (req: Request, res: Response) => {
  console.log('get app version');
  try {
    const data = await SystemController.getAppVersion();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

systemRouter.get('/sponsors', async (req: Request, res: Response) => {
  try {
    const data = await SystemController.getSponsors();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

systemRouter.get('/regions', async (req: Request, res: Response) => {
  try {
    const data = await SystemController.getRegions();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

systemRouter.get('/people-near-by', async (req: Request, res: Response) => {
  try {
    const data = await SystemController.getPeopleNearBy();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

systemRouter.get('/block-users', async (req: Request, res: Response) => {
  try {
    const data = await SystemController.getBlockUsers();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

systemRouter.post('/ml-texts', async (req: Request, res: Response) => {
  try {
    const { row_ids, column_names, locale } = req.body || {};
    const data = await SystemController.getMLTexts(row_ids, column_names, locale);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

systemRouter.post('/block-users', async (req: Request, res: Response) => {
  try {
    const { userId, blockUserId } = req.body || {};
    const data = await SystemController.blockUser(userId, blockUserId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
