import { Router } from "https://deno.land/x/oak/mod.ts";
import * as SystemController from "../controllers/systemController.ts";

export const systemRouter = new Router();

systemRouter.get("/maintenance", async (ctx) => {
  const data = await SystemController.getMaintenance();
  ctx.response.body = JSON.stringify(data);
});

systemRouter.get("/app-version", async (ctx) => {
  const data = await SystemController.getAppVersion();
  ctx.response.body = JSON.stringify(data);
});

systemRouter.get("/sponsors", async (ctx) => {
  const data = await SystemController.getSponsors();
  ctx.response.body = JSON.stringify(data);
});

systemRouter.get("/regions", async (ctx) => {
  const data = await SystemController.getRegions();
  ctx.response.body = JSON.stringify(data);
});

systemRouter.get("/people-near-by", async (ctx) => {
  const data = await SystemController.getPeopleNearBy();
  ctx.response.body = JSON.stringify(data);
});

systemRouter.get("/block-users", async (ctx) => {
  const data = await SystemController.getBlockUsers();
  ctx.response.body = JSON.stringify(data);
});

systemRouter.post("/ml-texts", async (ctx) => {
  const body = await ctx.request.body.json();
  const data = await SystemController.getMLTexts(body.row_ids, body.column_names, body.locale);
  ctx.response.body = JSON.stringify(data);
});

systemRouter.post('/block-users', async (ctx) => {
  const body = await ctx.request.body.json();
  const data = await SystemController.blockUser(body);
  ctx.response.body = JSON.stringify(data);
});
