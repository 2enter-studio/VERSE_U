import { Router, Request, Response } from 'express';
import * as AuthController from '../controllers/authController.ts';

export const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  try {
    const data = await AuthController.login(email, password);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post('/register', async (req: Request, res: Response) => {
  const { email, password, anon_key } = req.body || {};
  try {
    const data = await AuthController.register(email, password, anon_key);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post('/anonymous', async (_req: Request, res: Response) => {
  const data = await AuthController.anonymousLogin();
  res.json(data);
});

authRouter.post('/session', async (req: Request, res: Response) => {
  const { access_token, refresh_token } = req.body || {};
  const data = await AuthController.getSession(access_token, refresh_token);
  res.json(data);
});

authRouter.post('/set-password', async (req: Request, res: Response) => {
  const { password } = req.body || {};
  const data = await AuthController.setPassword(password);
  res.json(data);
});

authRouter.post('/change-password', async (req: Request, res: Response) => {
  const { old_password, new_password } = req.body || {};
  const data = await AuthController.changePassword(old_password, new_password);
  res.json(data);
});

authRouter.post('/forget-password', async (req: Request, res: Response) => {
  const { email } = req.body || {};
  const data = await AuthController.forgetPassword(email);
  res.json(data);
});

authRouter.post('/oauth-login', async (req: Request, res: Response) => {
  const { provider, options } = req.body || {};
  const data = await AuthController.signInWithOAuth(provider, options);
  res.json(data);
});

authRouter.post('/logout', async (_req: Request, res: Response) => {
  const data = await AuthController.logout();
  res.json(data);
});

authRouter.post('/trigger-one-o-one', async (req: Request, res: Response) => {
  const { anon_key, passcode, wearings } = req.body || {};
  try {
    const data = await AuthController.triggerOneOOne(anon_key, passcode, wearings);
    res.json(data);
  } catch (error) {
    switch (error.message) {
      case 'wrong passcode':
        res.status(403).json({ error: error.message });
        break;
      default:
        res.status(400).json({ error: error.message });
    }
  }
});
