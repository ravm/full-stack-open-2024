import { test, expect, describe, beforeEach } from "@playwright/test";
import { loginWith, createBlog } from "./helper";

const userData = {
  name: "Playwright Test",
  username: "test",
  password: "123",
};

const userData2 = {
  name: "Playwright Test 2",
  username: "test2",
  password: "123",
};

const blogData = {
  title: "Playwright test blog",
  author: "Playwright test author",
  url: "www.playwright.com",
};

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: userData,
    });
    await request.post("/api/users", {
      data: userData2,
    });
    await page.goto("/");
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
      await loginWith(page, userData.username, userData.password);
      await expect(page.getByText(`Logged in as ${userData.username}`)).toBeVisible();
    });

    test("login fails with incorrect credentials", async ({ page }) => {
      await loginWith(page, userData.username, "wrongpassword");
      const errorDiv = page.locator(".error")
      await expect(errorDiv).toContainText("Wrong username or password");
    });
  });
  
  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, userData.username, userData.password);
      await expect(page.getByText(`Logged in as ${userData.username}`)).toBeVisible();
    });

    test("user can create a blog", async ({ page }) => {
      await createBlog(
        page,
        blogData.title,
        blogData.author,
        blogData.url,
      );
      const successDiv = page.locator(".success");
      await expect(successDiv).toContainText(`${blogData.title} added`);
    });

    describe("Blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          blogData.title,
          blogData.author,
          blogData.url,
        );
        const successDiv = page.locator(".success");
        await expect(successDiv).toContainText(`${blogData.title} added`);
      });

      test("blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "Show" }).click();
        await page.getByRole("button", { name: "Like" }).click();
        await expect(page.getByText("Likes: 1")).toBeVisible();
      });

      test("own blog can be deleted", async ({ page }) => {
        page.on("dialog", async dialog => {
          await dialog.accept();
        });

        await page.getByRole("button", { name: "Show" }).click();
        await page.getByRole("button", { name: "Delete" }).click();
        await expect(page.getByText(`${blogData.title} by ${blogData.author}`)).not.toBeVisible();
      });
    });
  });

  describe("Blog created by other user", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, userData2.username, userData2.password);
      await expect(page.getByText(`Logged in as ${userData2.username}`)).toBeVisible();
      await createBlog(
        page,
        blogData.title,
        blogData.author,
        blogData.url,
      );
      const successDiv = page.locator(".success");
      await expect(successDiv).toContainText(`${blogData.title} added`);
      await page.getByRole("button", { name: "Log out" }).click();
    });

    test("user cannot see other user's blog's 'delete' button", async ({ page }) => {
      await loginWith(page, userData.username, userData.password);
      await expect(page.getByText(`Logged in as ${userData.username}`)).toBeVisible();

      await page.getByRole("button", { name: "Show" }).click();
      await expect(page.getByRole("button", { name: "Delete" })).not.toBeVisible();
    });
  });
});
