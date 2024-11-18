import { useState } from "react";

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const [blogDetailsVisible, setBlogDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setBlogDetailsVisible(!blogDetailsVisible);
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>{blogDetailsVisible ? "Hide" : "Show"}</button>
      </div>
      { blogDetailsVisible && (
        <div>
          <p>{blog.url}</p>
          <p>Likes: {blog.likes} <button onClick={() => likeBlog(blog)}>Like</button></p>
          <p>User: {blog.user.username}</p>
          <div>
            <button onClick={() => deleteBlog(blog)}>Delete</button>
          </div>
      </div>
      )}
    </div>
  );
}

export default Blog;
