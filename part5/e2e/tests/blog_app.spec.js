import { test, expect, describe, beforeEach, toContain } from "@playwright/test";
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

const blogData2 = {
  title: "Playwright test blog 2",
  author: "Playwright test author 2",
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

    test("blogs are arranged in order by most likes", async({ page }) => {
      await createBlog(page, blogData.title, blogData.author, blogData.url);
      await expect(page.locator(".success")).toContainText(`${blogData.title} added`);

      await createBlog(page, blogData2.title, blogData2.author, blogData2.url);
      await expect(page.locator(".success")).toContainText(`${blogData2.title} added`);

      // get the initial order of the blogs
      const firstBlog = page.locator("[data-testid='blog']").nth(0);
      const secondBlog = page.locator("[data-testid='blog']").nth(1);

      // ensure the initial order - blogData first, blogData2 second
      await expect(firstBlog).toHaveText(new RegExp(`${blogData.title} by ${blogData.author}`));
      await expect(secondBlog).toHaveText(new RegExp(`${blogData2.title} by ${blogData.author}`));

      // like the second blog (blogData2)
      await page.getByRole("button", { name: "Show" }).nth(1).click();
      await page.getByRole("button", { name: "Like" }).click();

      // ensure that the order has changed - blogData2 is now first with 1 like, blogData is second with 0 likes
      await expect(firstBlog).toHaveText(new RegExp(`${blogData2.title} by ${blogData2.author}`));
      await expect(secondBlog).toHaveText(new RegExp(`${blogData.title} by ${blogData.author}`));

      // like blogData (initial first blog, current second blog) twice
      await page.getByRole("button", { name: "Show" }).click();
      for (let i = 0; i < 2; i++) {
        await page.getByRole("button", { name: "Like" }).nth(1).click();
        await page.waitForTimeout(500);
      }

      // ensure that the order has changed again - blogData is now first with 2 likes, blogData2 is second with 1 like
      await expect(firstBlog).toHaveText(new RegExp(`${blogData.title} by ${blogData.author}`));
      await expect(secondBlog).toHaveText(new RegExp(`${blogData2.title} by ${blogData2.author}`));
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

    test("user cannot see other user's blog's delete button", async ({ page }) => {
      await loginWith(page, userData.username, userData.password);
      await expect(page.getByText(`Logged in as ${userData.username}`)).toBeVisible();

      await page.getByRole("button", { name: "Show" }).click();
      await expect(page.getByRole("button", { name: "Delete" })).not.toBeVisible();
    });
  });
});
