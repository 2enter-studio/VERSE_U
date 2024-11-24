import { Router } from 'https://deno.land/x/oak/mod.ts';
import * as EdgeFunctionController from '../controllers/edgeFunctionController.ts';
import * as ProfileController from '../controllers/profileController.ts';

export const edgeFunctionRouter = new Router();

edgeFunctionRouter.post('/set-trip', async (ctx) => {
  const body = await ctx.request.body.json();
  const data = await profileController.setTrip(body);
  ctx.response.body = JSON.stringify(data);
});

edgeFunctionRouter.post('/hai-an-road', async (ctx) => {
  const body = await ctx.request.body.json();
  const data = await EdgeFunctionController.triggerHaiAn(body);
  ctx.response.body = JSON.stringify(data);
});

edgeFunctionRouter.post('/use-coupon', async (ctx) => {
  const body = await ctx.request.body.json();
  const data = await edgeFunctionController.useCoupon(body);
  ctx.response.body = JSON.stringify(data);
});

edgeFunctionRouter.post('/one-o-one', async (ctx) => {
  const body = await ctx.request.body.json();
  const data = await edgeFunctionController.triggerOneOOne(body);
  ctx.response.body = JSON.stringify(data);
});
