import { Router } from "express";
import * as StorageController from "../controllers/storageController";

export const storageRouter = Router();

storageRouter.get("/:bucket/:filename", async (req, res) => {
  const data = await StorageController.downloadFile(req.params.bucket, req.params.filename);
  res.json(data);
});

storageRouter.get("/public/:bucket/:filename", async (req, res) => {
  const data = await StorageController.getFilePublicUrl(req.params.bucket, req.params.filename);
  res.json(data);
});
