const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog
    .find({}).populate("user", { username: 1, name: 1 })
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const { title, author, url, likes } = req.body;
  const user = req.user;

  if (!title || !url) {
    res.status(400).end();
  } else {
    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user.id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    const populatedBlog = await Blog.findById(savedBlog._id).populate("user", { username: 1, name: 1 });
    res.status(201).json(populatedBlog);
  }
});

blogsRouter.delete("/:id", async (req, res) => {
  const user = req.user;
  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } else {
    return res.status(401).json({ error: "unauthorized" });
  }
});

blogsRouter.put("/:id", async(req, res) => {
  const { title, author, url, likes } = req.body;

  const updatedBlog = {
    title,
    author,
    url,
    likes,
  }

  const updatedBlogRes = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true }).populate("user", { username: 1, name: 1 });
  res.status(200).json(updatedBlogRes);
});

module.exports = blogsRouter;
