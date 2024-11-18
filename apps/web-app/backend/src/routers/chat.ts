import {
  fetchUserChats,
  fetchChatMessages,
  postMessage,
} from "../controllers/chatController.ts";

export const chatRouter = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  try {
    // Get user's chats
    if (path.startsWith("/chats/") && method === "GET") {
      const userId = path.split("/")[2];
      const data = await fetchUserChats(userId);
      return new Response(JSON.stringify(data), { status: 200 });
    }

    // Get chat messages
    if (path.startsWith("/chats/") && path.includes("/messages") && method === "GET") {
      const chatId = path.split("/")[2];
      const data = await fetchChatMessages(chatId);
      return new Response(JSON.stringify(data), { status: 200 });
    }

    // Send message
    if (path.startsWith("/chats/") && path.includes("/messages") && method === "POST") {
      const chatId = path.split("/")[2];
      const { content, sender } = await req.json();
      const data = await postMessage(chatId, content, sender);
      return new Response(JSON.stringify(data), { status: 201 });
    }

    return new Response("Not Found", { status: 404 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
