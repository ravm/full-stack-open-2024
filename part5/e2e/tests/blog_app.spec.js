import { test, expect, describe, beforeEach } from "@playwright/test";

const userdata = {
  name: "Tim Tester",
  username: "timtest",
  password: "123",
};

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: userdata,
    });
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const LogInTextLocator = page.getByText("Log in to application");

    await expect(LogInTextLocator).toBeVisible();
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  describe("Login", () => {
    test("login succeeds with correct credentials", async ({ page }) => {
      page.getByTestId("username").fill(userdata.username);
      page.getByTestId("password").fill(userdata.password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText(`Logged in as ${userdata.username}`)).toBeVisible();
    });

    test("login fails with incorrect credentials", async ({ page }) => {
      page.getByTestId("username").fill(userdata.name);
      page.getByTestId("password").fill("wrongpassword");
      await page.getByRole("button", { name: "Login" }).click();

      const errorDiv = page.locator(".error")
      await expect(errorDiv).toContainText("Wrong username or password");
    });
  });
});
