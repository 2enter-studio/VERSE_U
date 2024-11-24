import { Router } from "https://deno.land/x/oak/mod.ts";
import * as StorageController from "../controllers/storageController.ts";

export const storageRouter = new Router();

storageRouter.get("/:bucket/:filename", async (ctx) => {
  const data = await StorageController.downloadFile(ctx.params.bucket, ctx.params.filename);
  ctx.response.body = JSON.stringify(data);
});

storageRouter.get("/public/:bucket/:filename", async (ctx) => {
  const data = await StorageController.getFilePublicUrl(ctx.params.bucket, ctx.params.filename);
  ctx.response.body = JSON.stringify(data);
});
