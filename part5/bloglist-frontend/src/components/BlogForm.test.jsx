import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("blog creation is successful", async () => {
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByPlaceholderText("Blog title");
  const authorInput = screen.getByPlaceholderText("Blog author");
  const urlInput = screen.getByPlaceholderText("Blog url");
  const createButton = screen.getByText("Create");

  await userEvent.type(titleInput, "Test blog");
  await userEvent.type(authorInput, "Test author");
  await userEvent.type(urlInput, "Test url");

  await userEvent.click(createButton);
  
  expect(createBlog.mock.calls).toHaveLength(1);

  expect(createBlog.mock.calls[0][0].title).toBe("Test blog");
  expect(createBlog.mock.calls[0][0].author).toBe("Test author");
  expect(createBlog.mock.calls[0][0].url).toBe("Test url");
});
