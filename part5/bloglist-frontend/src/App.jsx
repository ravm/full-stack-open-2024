import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./index.css";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    const fetchBlogs = async () => {
      if (user) {
        try {
          const allBlogs = await blogService.getAll(user.token);
          setBlogs(allBlogs);
        } catch (exception) {
          console.log(exception);
        }
      }
    };
    fetchBlogs();
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      const createdBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(createdBlog));
      setMessage(`${createdBlog.title} added`);
      setMessageType("success");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 4000);
    } catch (exception) {
      console.log(exception);
    }
  };

  const likeBlog = async (blogObject) => {
    try {
      const updatedBlog = {
        ...blogObject,
        likes: blogObject.likes + 1,
      };
      const returnedBlog = await blogService.update(updatedBlog);
      setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog));
    } catch (exception) {
      console.log(exception);
    }
  };

  const deleteBlog = async (blogObject) => {
    try {
      if (window.confirm(`Delete ${blogObject.title} by ${blogObject.author}?`)) {
        await blogService.deleteBlog(blogObject);
        setBlogs(blogs.filter(blog => blog.id !== blogObject.id));
      }
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username, password,
      });
      window.localStorage.setItem(
        "loggedBlogAppUser", JSON.stringify(user),
      );
      blogService.setToken(user.token);
      setUser(user);
      setUserName("");
      setPassword("");
    } catch (exception) {
      setMessageType("error");
      setMessage("Wrong username or password");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 4000);
    }
  };

  const logOut = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  return (
    <div>
      { user === null ?
        <div>
          <h1>Log in to application</h1>
          <Notification message={message} type={messageType} />
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={setUserName}
            setPassword={setPassword}
          />
        </div>
        :
        <div>
          <h1>Blogs</h1>
          <h4>Logged in as {user.username} <button onClick={logOut}>Log out</button></h4>
          <Notification message={message} type={messageType} />
          <Togglable buttonLabelOpen="Create new blog" buttonLabelClose="Cancel" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.sort((a, b) => b.likes - a.likes).map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              likeBlog={likeBlog}
              deleteBlog={deleteBlog}
              loggedUser={user} 
            />
          ))}
        </div>
      }
    </div>
  );
};

export default App;
