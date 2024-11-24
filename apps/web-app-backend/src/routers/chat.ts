import { Router } from "https://deno.land/x/oak/mod.ts";
import * as ChatController from "../controllers/chatController.ts";

export const chatRouter = new Router();

chatRouter.get("/chats/:userId", async (ctx) => {
  const userId = ctx.params.userId;
  const chatIds = ctx.query.chatIds;
  try {
    if (chatIds) {
      const data = await ChatController.fetchChats(userId, chatIds);
    } else {
      const data = await ChatController.fetchUserChats(userId);
    }
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});

chatRouter.get("/chats/:userId/messages", async (ctx) => {
  const userId = ctx.params.userId;
  const chatId = ctx.params.chatId;
  try {
    const data = await ChatController.fetchChatMessages(chatId);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});

chatRouter.post("/chats/:chatId/messages", async (ctx) => {
  const chatId = ctx.params.chatId;
  const { content, sender } = await ctx.request.body.json();
  try {
    const data = await ChatController.postMessage(chatId, content, sender);
    ctx.response.body = JSON.stringify(data);
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({ error: error.message });
  }
});

