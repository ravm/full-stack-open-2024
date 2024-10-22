const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const listWithManyBlogs = [
  {
    _id: "5a422aa71b54a676234d17f1",
    title: "The Strange Case of the Alchemist's Daughter",
    author: "Theodora Goss",
    url: "https://bookshop.org/p/books/the-strange-case-of-the-alchemist-s-daughter-volume-1-theodora-goss/217995?ean=9781481466516",
    likes: 3,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f9",
    title: "A Boy and His Dog at the End of the World",
    author: "C. a. Fletcher",
    url: "https://bookshop.org/p/books/a-boy-and-his-dog-at-the-end-of-the-world-c-a-fletcher/113361?ean=9780316449434",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f2",
    title: "American Gods",
    author: "Neil Gaiman",
    url: "https://bookshop.org/p/books/american-gods-neil-gaiman/6438874?ean=9780063081918",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f0",
    title: "The Graveyard Book",
    author: "Neil Gaiman",
    url: "https://www.goodreads.com/book/show/2213661.The_Graveyard_Book",
    likes: 0,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const emptyList = [];
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    }
  ];

  test("empty blog list equals zero", () => {
    const result = listHelper.totalLikes(emptyList);
    assert.strictEqual(result, 0);
  });

  test("when list has one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("bigger blog list is calculated correctly", () => {
    const result = listHelper.totalLikes(listWithManyBlogs);
    assert.strictEqual(result, 20)
  });
});

describe("favorite blog", () => {
  test("blog with the most likes", () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs);
    assert.deepStrictEqual(
      result,
      {
        title: "A Boy and His Dog at the End of the World",
        author: "C. a. Fletcher",
        likes: 7,
      }
    );
  });
});

describe("most blogs", () => {
  test("author with the most blogs", () => {
    const result = listHelper.mostBlogs(listWithManyBlogs);
    assert.deepStrictEqual(
      result,
      {
        author: "Neil Gaiman",
        blogs: 2,
      }
    );
  });
});

describe("most likes", () => {
  test("author with most likes", () => {
    const result = listHelper.mostLikes(listWithManyBlogs);
    assert.deepStrictEqual(
      result,
      {
        author: "C. a. Fletcher",
        likes: 7
      }
    );
  });
});
