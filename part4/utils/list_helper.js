const dummy = blogs => {
  return 1;
};

const totalLikes = blogPosts => {
  let sum = 0;
  blogPosts.map((blogPost) => sum += blogPost.likes);
  return sum;
};

module.exports = {
  dummy,
  totalLikes,
};
