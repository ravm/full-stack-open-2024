const { test, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("application contains one blog that is returned as json", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.length, 1);
});

test("verify unique identifier of blog posts", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];
  assert.strictEqual(blog.hasOwnProperty("id"), true);
});

test("verify successful blog post creation", async () => {
  const numberOfBlogsBeforePost = (await api.get("/api/blogs")).body.length;
  
  const blog = {
    title: "test POST blog",
    author: "supertest",
    url: "http://localhost:3003/api/blogs",
    likes: 1,
  };

  const response = await api
    .post("/api/blogs")
    .send(blog);

  assert.strictEqual(response.status, 201);
  
  const numberOfBlogsAfterPost = (await api.get("/api/blogs")).body.length;
  assert.strictEqual(numberOfBlogsAfterPost > numberOfBlogsBeforePost, true)
});

after(async () => {
  await mongoose.connection.close();
});
