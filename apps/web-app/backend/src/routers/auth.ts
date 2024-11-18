import { login, register } from "../controllers/authController.ts";

export const authRouter = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  try {
    if (path === "/auth/login" && method === "POST") {
      const { email, password } = await req.json();
      const data = await login(email, password);
      return new Response(JSON.stringify(data), { status: 200 });
    }

    if (path === "/auth/register" && method === "POST") {
      const { email, password, name } = await req.json();
      const data = await register(email, password, name);
      return new Response(JSON.stringify(data), { status: 201 });
    }

    return new Response("Not Found", { status: 404 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
