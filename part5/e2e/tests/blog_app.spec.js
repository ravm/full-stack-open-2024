import { test, expect, describe, beforeEach } from "@playwright/test";
import { loginWith } from "./helper";

const userdata = {
  name: "Playwright Test",
  username: "test",
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
      await loginWith(page, userdata.username, userdata.password);
      await expect(page.getByText(`Logged in as ${userdata.username}`)).toBeVisible();
    });

    test("login fails with incorrect credentials", async ({ page }) => {
      await loginWith(page, userdata.username, "wrongpassword");
      const errorDiv = page.locator(".error")
      await expect(errorDiv).toContainText("Wrong username or password");
    });
  });
  
  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, userdata.username, userdata.password);
      await expect(page.getByText(`Logged in as ${userdata.username}`)).toBeVisible();
    });

    test("user can create a blog", async ({ page }) => {
      await page.getByRole("button", { name: "Create new blog" }).click();
      await page.getByTestId("title").fill("Playwright test blog");
      await page.getByTestId("author").fill("Playwright test author");
      await page.getByTestId("url").fill("www.playwright.com");
      await page.getByRole("button", { name: "Create" }).click();

      const successDiv = page.locator(".success");
      await expect(successDiv).toContainText("Playwright test blog added");
    });
  });
});
