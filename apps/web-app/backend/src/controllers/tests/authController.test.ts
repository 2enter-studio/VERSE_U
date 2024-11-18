import { login, register } from "../authController.ts";

Deno.test("login: should succeed with valid credentials", async () => {
  const mockEmail = "test@example.com";
  const mockPassword = "password123";

  const result = await login(mockEmail, mockPassword);

  console.assert(result.user !== undefined, "User should be defined");
  console.assert(result.profile !== undefined, "Profile should be defined");
  console.assert(result.session !== undefined, "Session should be defined");
});

Deno.test("register: should register a user successfully", async () => {
  const mockEmail = "newuser@example.com";
  const mockPassword = "password123";
  const mockName = "New User";

  const result = await register(mockEmail, mockPassword, mockName);

  console.assert(result.user !== undefined, "User should be defined");
  console.assert(result.session !== undefined, "Session should be defined");
});
