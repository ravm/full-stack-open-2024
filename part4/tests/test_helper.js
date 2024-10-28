const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "initial blog",
    author: "initialization",
    url: "http://localhost:3003/api/blogs",
    likes: 5,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ content: "willremovethissoon" });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
}

const notesInDb = async () => {
  const notes = await Blog.find({});
  return notes.map(blog => blog.toJSON());
}

module.exports = {
  initialBlogs, nonExistingId, notesInDb
}
