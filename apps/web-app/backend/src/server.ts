import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { authRouter, profileRouter, chatRouter, wearingRouter } from "./routers/index.ts";

async function mainRouter(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/auth")) {
    return await authRouter(req);
  }

  if (url.pathname.startsWith("/profile")) {
    return await profileRouter(req);
  }

  if (url.pathname.startsWith("/chats")) {
    return await chatRouter(req);
  }

  if (url.pathname.startsWith("/wearings")) {
    return await wearingRouter(req);
  }

  return new Response("Not Found", { status: 404 });
}

console.log("Server running at http://localhost:5179");
serve(mainRouter, { port: 5179 });
