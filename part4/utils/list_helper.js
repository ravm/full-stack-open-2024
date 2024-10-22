const _ = require("lodash");

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

const mostBlogs = blogs => {
  let authorWithMostBlogs = {
    author: "",
    blogs: 0,
  };
  const authors = blogs.map(blog => blog.author);
  const freqOfAuthors = _.countBy(authors);
  authorWithMostBlogs.author = _.maxBy(Object.keys(freqOfAuthors), o => freqOfAuthors[o]);
  authorWithMostBlogs.blogs = _.maxBy(Object.values(freqOfAuthors));
  return authorWithMostBlogs;
};

const mostLikes = blogs => {
  let authorWithMostLikes = {
    author: "",
    likes: 0,
  };
  const authorLikes = {};
  
  blogs.forEach(blog => {
    if (authorLikes[blog.author]) {
      authorLikes[blog.author] += blog.likes;
    } else {
      authorLikes[blog.author] = blog.likes;
    }
  });

  for (const author in authorLikes) {
    if (authorLikes[author] > authorWithMostLikes.likes) {
      authorWithMostLikes = {
        author: author,
        likes: authorLikes[author],
      };
    }
  }
  return authorWithMostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
