const Blog = require("../models/blog");
const User = require("../models/user");

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

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
}

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
