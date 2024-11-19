import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders only blog's title and author", () => {
  const blog = {
    author: "React library",
    id: "123",
    likes: 0,
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

test("blog's url and likes are shown when clicking 'Show'", async () => {
  const blog = {
    author: "React library",
    id: "123",
    likes: 0,
    title: "URL & likes test",
    url: "www.test.com",
    user: {
      id: "321",
      username: "testUser",
    },
  };

  render(<Blog blog={blog} likeBlog={vi.fn()} deleteBlog={vi.fn()} />);

  const user = userEvent.setup();
  const showButton = screen.getByText("Show");
  await user.click(showButton);

  const urlElement = screen.getByText("www.test.com");
  const likesElement = screen.getByText("Likes: 0");

  expect(urlElement).toBeDefined();
  expect(likesElement).toBeDefined();
});

test("like button is clicked twice", async () => {
  const blog = {
    author: "React library",
    id: "123",
    likes: 0,
    title: "Like button is clicked twice",
    url: "www.test.com",
    user: {
      id: "321",
      username: "testUser",
    },
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} likeBlog={mockHandler} deleteBlog={vi.fn()} />);

  const user = userEvent.setup();
  
  const showButton = screen.getByText("Show");
  await user.click(showButton);

  const likeButton = screen.getByText("Like");
  for (let i = 0; i < 2; i++) await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
