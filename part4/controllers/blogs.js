const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const blog = new Blog(req.body);
  if (!blog.title || !blog.url) {
    res.status(400).end();
  } else {
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogsRouter.put("/:id", async(req, res) => {
  const { title, author, url, likes } = req.body;

  const updatedBlog = {
    title,
    author,
    url,
    likes,
  };

  await Blog.findByIdAndUpdate(req.params.id, updatedBlog);
  res.status(200).end();
});

module.exports = blogsRouter;
