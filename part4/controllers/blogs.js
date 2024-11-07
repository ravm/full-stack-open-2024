const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { tokenExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog
    .find({}).populate("user", { username: 1, name: 1 })
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const { title, author, url, likes } = req.body;
  let userId = req.body.userId;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  if (!userId) {
    userId = user._id;
  }

  if (!title || !url) {
    res.status(400).end();
  } else {
    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: userId,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
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
  }

  await Blog.findByIdAndUpdate(req.params.id, updatedBlog);
  res.status(200).end();
});

module.exports = blogsRouter;
