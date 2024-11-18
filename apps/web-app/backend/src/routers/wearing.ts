import {
  fetchUserWearings,
  updateWearingStatus,
} from "../controllers/wearingController.ts";

export const wearingRouter = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  try {
    // Get user's wearings
    if (path.startsWith("/wearings/") && method === "GET") {
      const userId = path.split("/")[2];
      const data = await fetchUserWearings(userId);
      return new Response(JSON.stringify(data), { status: 200 });
    }

    // Toggle wearing equipment status
    if (path.startsWith("/wearings/") && path.includes("/toggle") && method === "PUT") {
      const wearingId = path.split("/")[2];
      const { userId, equipped } = await req.json();
      const data = await updateWearingStatus(wearingId, userId, equipped);
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
