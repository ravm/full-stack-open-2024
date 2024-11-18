import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      await createBlog(newBlog);
      setNewBlog({
        title: "",
        author: "",
        url: "",
      });
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
        Title:
          <input
            type="text"
            value={newBlog.title}
            name="title"
            onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
          />
        </div>
        <div>
        Author:
          <input
            value={newBlog.author}
            name="author"
            onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
          />
        </div>
        <div>
        Url:
          <input
            type="text"
            value={newBlog.url}
            name="url"
            onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
