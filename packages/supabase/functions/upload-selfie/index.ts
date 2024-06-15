import { corsHeaders } from "../_shared/cors.ts";
import { admin, validateUser } from "../_shared/db.ts";
import { createError, createSuccess } from "../_shared/response.ts";

Deno.serve(async (req) => {
  // handle preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // validate user
  const user = await validateUser(req);
  if (!user) return createError("invalid auth token");

  // get option from request body
  const body = await req.json();
  const image = body.image as ArrayBuffer;
  const { error } = admin.storage.from("user-data").upload(
    `${user.id}/selfie`,
    image,
    { type: "image/webp" },
  );
  if (error) return createError(error.message, { status: 500 });

  return createSuccess({});
});
