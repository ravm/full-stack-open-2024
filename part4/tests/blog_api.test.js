const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

describe("blog tests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test("application contains initial blogs that are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });
  
  test("verify unique identifier of blog posts", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];
    assert.strictEqual(blog.hasOwnProperty("id"), true);
  });
  
  test("verify successful blog post creation", async () => {
    const numberOfBlogsBeforePost = (await helper.blogsInDb()).length;
    
    const blog = {
      title: "test POST blog",
      author: "supertest",
      url: "http://localhost:3003/api/blogs",
      likes: 1,
    };
  
    await api
      .post("/api/blogs")
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
    
    const numberOfBlogsAfterPost = (await helper.blogsInDb()).length;
    assert.strictEqual(numberOfBlogsAfterPost, numberOfBlogsBeforePost + 1);
  });
  
  test("blog post creation without likes will default to 0", async () => {
    const blog = {
      title: "test blog without likes",
      author: "supertest",
      url: "http://localhost:3003/api/blogs",
    };
  
    const response = await api
      .post("/api/blogs")
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
  
    assert.strictEqual(response.body.likes, 0);
  });
  
  test("blog post creation without title or url -> bad request", async () => {
    const blog = {
      author: "supertest",
      likes: 2,
    };
    
    await api
      .post("/api/blogs")
      .send(blog)
      .expect(400)
  });
  
  test("update a single blog post", async () => {
    const blogsBeforeUpdate = await helper.blogsInDb();
    const blogId = blogsBeforeUpdate[0].id;
  
    const updatedBlog = {...blogsBeforeUpdate[0]};
    updatedBlog.likes = 999;
  
    await api
      .put(`/api/blogs/${blogId}`)
      .send(updatedBlog)
      .expect(200)
  
    const blogsAfterUpdate = await helper.blogsInDb();
    assert.strictEqual(blogsAfterUpdate[0].likes === blogsBeforeUpdate[0].likes, false);
  });
  
  test("delete a single blog post", async () => {
    const blogs = await helper.blogsInDb();
    const blogId = blogs[0].id;
  
    await api
      .delete(`/api/blogs/${blogId}`)
      .expect(204)
    
    const numberOfBlogsAfterDelete = (await helper.blogsInDb()).length;
    assert.strictEqual(numberOfBlogsAfterDelete < blogs.length, true);
  });
});

describe("user tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("successful user creation with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ravm",
      name: "Miika Ravi",
      password: "password",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("user creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "root",
      name: "SuperUser",
      password: "root",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("user creation fails with proper statuscode and message if no username is given", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      name: "Test Guy",
      password: "root",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("username and password must be atleast 3 characters long"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("user creation fails with proper statuscode and message if no password is given", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "nopw",
      name: "Test Guy",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("username and password must be atleast 3 characters long"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("user creation fails with proper statuscode and message if username is too short", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "tg",
      name: "Test Guy",
      password: "root",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("username and password must be atleast 3 characters long"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("user creation fails with proper statuscode and message if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "shortpw",
      name: "Test Guy",
      password: "tg",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("username and password must be atleast 3 characters long"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
