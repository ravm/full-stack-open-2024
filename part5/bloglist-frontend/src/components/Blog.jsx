const Blog = ({ blog }) => (
  <div>
    <p>Title: {blog.title}</p>
    <p>Author: {blog.author}</p>
    <p>Url: {blog.url}</p>
    <p>Likes: {blog.likes}</p>
  </div>
);

export default Blog;
