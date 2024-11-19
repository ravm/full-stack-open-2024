import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const [blogDetailsVisible, setBlogDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setBlogDetailsVisible(!blogDetailsVisible);
  };

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
};

Blog.propTypes = {
  blog: PropTypes.shape({
    author: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    likes: PropTypes.number,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;
