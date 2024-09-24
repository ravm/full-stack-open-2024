const dummy = blogs => {
  return 1;
};

const totalLikes = blogPosts => {
  let sum = 0;
  blogPosts.map((blogPost) => sum += blogPost.likes);
  return sum;
};

const favoriteBlog = blogs => {
  let favBlog = {
    title: "",
    author: "",
    likes: 0,
  };

  blogs.map((blog) => {
    if (blog.likes > favBlog.likes) {
      favBlog.title = blog.title;
      favBlog.author = blog.author;
      favBlog.likes = blog.likes;
    }
  });
  return favBlog;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
