import { Router, Request, Response } from 'express';
import * as EdgeFunctionController from '../controllers/edgeFunctionController.ts';
import * as ProfileController from '../controllers/profileController.ts';

export const edgeFunctionRouter = Router();

edgeFunctionRouter.post('/set-trip', async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const data = await ProfileController.setTrip(body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

edgeFunctionRouter.post('/hai-an-road', async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const data = await EdgeFunctionController.triggerHaiAn(body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

edgeFunctionRouter.post('/use-coupon', async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const data = await EdgeFunctionController.useCoupon(body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

edgeFunctionRouter.post('/one-o-one', async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const data = await EdgeFunctionController.triggerOneOOne(body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
