import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Blog from "./Blog";

test("renders only blog's title and author", () => {
  const blog = {
    id: "123",
    author: "React library",
    title: "Content render test",
    url: "www.test.com",
    user: {
      id: "321",
      username: "testUser",
    },
  };
  render(<Blog blog={blog} likeBlog={vi.fn()} deleteBlog={vi.fn()} />);

  const titleAndAuthorElement = screen.getByText("Content render test by React library");
  expect(titleAndAuthorElement).toBeDefined();

  const urlElement = screen.queryByText("www.test.com");
  const likesElement = screen.queryByText("Likes: 0");

  expect(urlElement).toBeNull();
  expect(likesElement).toBeNull();
});
