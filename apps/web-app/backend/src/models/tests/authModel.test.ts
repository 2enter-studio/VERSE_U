import { signIn, signUp } from "../authModel.ts";

Deno.test("signIn: should succeed with valid credentials", async () => {
  const mockEmail = "test@example.com";
  const mockPassword = "password123";

  const { data, error } = await signIn(mockEmail, mockPassword);

  console.assert(data !== undefined, "Data should be defined");
  console.assert(error === null, "Error should be null");
});

Deno.test("signUp: should succeed with valid details", async () => {
  const mockEmail = "newuser@example.com";
  const mockPassword = "password123";

  const { data, error } = await signUp(mockEmail, mockPassword);

  console.assert(data !== undefined, "Data should be defined");
  console.assert(error === null, "Error should be null");
});
