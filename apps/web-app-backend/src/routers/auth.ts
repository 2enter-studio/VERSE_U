import { Router } from "https://deno.land/x/oak/mod.ts";
import * as AuthController from "../controllers/authController.ts";

export const authRouter = new Router();

authRouter.post("/login", async (ctx) => {
  const body = await ctx.request.body.json();
  const { email, password } = body;
  try {
    const data = await AuthController.login(email, password);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});



authRouter.post("/register", async (ctx) => {
  const { email, password, anon_key } = await ctx.request.body.json();
  try {
    const data = await AuthController.register(email, password, anon_key);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});

authRouter.post("/anonymous", async (ctx) => {
  const data = await AuthController.anonymousLogin();
  ctx.response.body = JSON.stringify(data);
});

authRouter.post("/session", async (ctx) => {
  const body = await ctx.request.body // 獲取 JSON 資料
  const { access_token, refresh_token } = body;
  const data = await AuthController.getSession(access_token, refresh_token);
  ctx.response.body = JSON.stringify(data);
});

authRouter.post("/set-password", async (ctx) => {
  const { password } = await ctx.request.body.json();
  const data = await AuthController.setPassword(password);
  ctx.response.body = JSON.stringify(data);
});

authRouter.post("/change-password", async (ctx) => {
  const { old_password, new_password } = await ctx.request.body.json();
  const data = await AuthController.changePassword(old_password, new_password);
  ctx.response.body = JSON.stringify(data);
});

authRouter.post("/forget-password", async (ctx) => {
  const { email } = await ctx.request.body.json();
  const data = await AuthController.forgetPassword(email);
  ctx.response.body = JSON.stringify(data);
});

authRouter.post("/oauth-login", async (ctx) => {
  const { provider, options } = await ctx.request.body.json();
  const data = await AuthController.signInWithOAuth(provider, options);
  ctx.response.body = JSON.stringify(data);
});

authRouter.post("/logout", async (ctx) => {
  const data = await AuthController.logout();
  ctx.response.body = JSON.stringify(data);
});

authRouter.post("/trigger-one-o-one", async (ctx) => {
  const { anon_key, passcode, wearings } = await ctx.request.body.json();
  try {
    const data = await AuthController.triggerOneOOne(anon_key, passcode, wearings);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    switch (error.message) {
      case "wrong passcode":
        ctx.response.status = 403;
        ctx.response.body = JSON.stringify({ error: error.message });
        break;
      default:
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify({ error: error.message });
    }
  } 
  
});
