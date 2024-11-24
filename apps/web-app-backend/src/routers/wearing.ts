import { Router } from "https://deno.land/x/oak/mod.ts";
import * as WearingController from "../controllers/wearingController.ts";

export const wearingRouter = new Router();

wearingRouter.get("/user/:userId", async (ctx) => {
  const userId = ctx.params.userId;

  try {
    const data = await WearingController.fetchUserWearings(userId);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});

wearingRouter.put("/update-wearing-status/:wearingId", async (ctx) => {
  const wearingId = ctx.params.wearingId;
  const { userId, equipped } = await ctx.request.body.json();
  try {
    const data = await WearingController.updateWearingStatus(wearingId, userId, equipped);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});

wearingRouter.get("/meshes", async (ctx) => {
  const data = await WearingController.getMeshes();
  ctx.response.body = JSON.stringify(data);
});

wearingRouter.get("/wearings", async (ctx) => {
  const data = await WearingController.getWearings();
  ctx.response.body = JSON.stringify(data);
});

wearingRouter.get("/owned-wearings/:userId", async (ctx) => {
  const userId = ctx.params.userId;
  const data = await WearingController.getOwnedWearings(userId);
  ctx.response.body = JSON.stringify(data);
});

wearingRouter.post("/owned-wearings/:userId", async (ctx) => {
  const userId = ctx.params.userId;
  const data = await WearingController.insertOwnedWearings(userId, await ctx.request.body.json());
  ctx.response.body = JSON.stringify(data);
});

wearingRouter.get("/starter-pack", async (ctx) => {
  const data = await WearingController.getStarterPack();
  ctx.response.body = JSON.stringify(data);
});

wearingRouter.post("/owned-wearings/:userId", async (ctx) => {
  const userId = ctx.params.userId;
  const data = await WearingController.insertStarterPack(await ctx.request.body.json(), userId);
  ctx.response.body = JSON.stringify(data);
});

wearingRouter.post("/equip-wearings/:userId", async (ctx) => {
  const userId = ctx.params.userId;
  const { wearingIds } = await ctx.request.body.json();
  const data = await WearingController.equipWearings(userId, wearingIds);
  ctx.response.body = JSON.stringify(data);
});

wearingRouter.post("/unequip-wearings/:userId", async (ctx) => {
  const userId = ctx.params.userId;
  const { wearingIds } = await ctx.request.body.json();
  const data = await WearingController.unequipWearings(userId, wearingIds);
  ctx.response.body = JSON.stringify(data);
});
