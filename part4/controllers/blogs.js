const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog
    .find({}).populate("user", { username: 1, name: 1 })
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const { title, author, url, likes } = req.body;
  let userId = req.body.userId;
  
  if (!userId) {
    const users = await User.find({});
    userId = users[0]._id;
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

    const user = await User.findById(userId);
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
