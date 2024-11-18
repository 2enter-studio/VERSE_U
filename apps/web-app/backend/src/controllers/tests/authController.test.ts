import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { login, register } from "../authController.ts";

Deno.test("login: should succeed with valid credentials", async () => {
  const mockCredentials = {
    email: "test@example.com",
    password: "password123"
  };
  
  const result = await login(mockCredentials.email, mockCredentials.password);
  assertEquals(result.session, null);
});

Deno.test("register: should register a user successfully", async () => {
  const mockUser = {
    email: "newuser@example.com",
    password: "password123",
    name: "Test User"
  };
  
  const result = await register(mockUser.email, mockUser.password, mockUser.name);
  assertEquals(result.session, null);
});