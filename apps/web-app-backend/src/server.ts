// import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { router } from "./routers/index.ts";

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running at http://localhost:5179");
await app.listen({ port: 5179 });
