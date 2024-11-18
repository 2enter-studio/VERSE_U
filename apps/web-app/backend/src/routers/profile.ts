import { getProfile, updateProfile } from "../controllers/profileController.ts";

export const profileRouter = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  try {
    // Get profile
    if (path.startsWith("/profile/") && method === "GET") {
      const userId = path.split("/").pop()!;
      const data = await getProfile(userId);
      return new Response(JSON.stringify(data), { status: 200 });
    }

    // Update profile
    if (path.startsWith("/profile/") && method === "PUT") {
      const userId = path.split("/").pop()!;
      const updates = await req.json();
      const data = await updateProfile(userId, updates);
      return new Response(JSON.stringify(data), { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
