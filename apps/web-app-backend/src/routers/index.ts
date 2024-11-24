import { Router } from "https://deno.land/x/oak/mod.ts";
import { authRouter } from "./auth.ts";
import { profileRouter } from "./profile.ts";
import { chatRouter } from "./chat.ts";
import { wearingRouter } from "./wearing.ts";
import { systemRouter } from "./system.ts";
import { storageRouter } from "./storage.ts";

export const router = new Router();
router.use("/api/auth", authRouter.routes(), authRouter.allowedMethods());
router.use("/api/profile", profileRouter.routes(), profileRouter.allowedMethods());
router.use("/api/chats", chatRouter.routes(), chatRouter.allowedMethods());
router.use("/api/wearings", wearingRouter.routes(), wearingRouter.allowedMethods());
router.use("/api/system", systemRouter.routes(), systemRouter.allowedMethods());
router.use("/api/storage", storageRouter.routes(), storageRouter.allowedMethods());
