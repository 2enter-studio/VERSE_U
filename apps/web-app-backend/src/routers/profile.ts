import { Router } from "https://deno.land/x/oak/mod.ts";
import * as ProfileController from "../controllers/profileController.ts";

export const profileRouter = new Router();

profileRouter.get("/:userId", async (ctx) => {
  const userId = ctx.params.userId;

  try {
    const data = await ProfileController.getProfile(userId);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});

profileRouter.post("/:userId", async (ctx) => {
  const userId = ctx.params.userId;
  const { value } = await ctx.request.body.json();
  try {
    const data = await ProfileController.createProfile(value);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});

profileRouter.put("/:userId", async (ctx) => {
  const userId = ctx.params.userId;
  const updates = await ctx.request.body.json();
  try {
    const data = await ProfileController.updateProfile(userId, updates);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});

profileRouter.patch("/trip/:userId", async (ctx) => {
  const userId = ctx.params.userId;
  const updates = await ctx.request.body.json();
  try {
    const data = await ProfileController.updateTrip(userId, updates);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});

profileRouter.get("/trip/:userId", async (ctx) => {
  const userId = ctx.params.userId;
  try {
    const data = await ProfileController.getTrip(userId);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});
