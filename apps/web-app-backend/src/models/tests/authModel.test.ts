import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { signIn, signUp } from "../authModel.ts";

Deno.test("signIn: should succeed with valid credentials", async () => {
  const mockCredentials = {
    email: "test@example.com",
    password: "password123"
  };
  
  const { data, error } = await signIn(mockCredentials.email, mockCredentials.password);
  assertEquals(error, null);
});

Deno.test("signUp: should succeed with valid details", async () => {
  const mockUser = {
    email: "newuser@example.com",
    password: "password123"
  };
  
  const { data, error } = await signUp(mockUser.email, mockUser.password);
  assertEquals(error, null);
});