import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./index.css";

const App = () => {
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      if (user) {
        try {
          const allBlogs = await blogService.getAll(user.token);
          const userBlogs = allBlogs.filter(blog => blog.user && blog.user.username === user.username);
          setBlogs(userBlogs);
        } catch (error) {
          console.log(error);
        }
      }
    }
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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username, password,
      });
      window.localStorage.setItem(
        "loggedBlogAppUser", JSON.stringify(user)
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
  }

  const logOut = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  }

  const addBlog = (event) => {
    event.preventDefault();
    blogService.create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog));
        setMessage(`${newBlog.title} added`);
        setMessageType("success");
        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 4000);
        setNewBlog({
          title: "",
          author: "",
          url: "",
        });
      });
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username
          <input
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUserName(target.value)}
        />
      </div>
      <div>
        Password
          <input
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <h2>Create new blog</h2>
        Title:
          <input
            type="text"
            value={newBlog.title}
            name="title"
            onChange={({ target }) => setNewBlog({...newBlog, title: target.value})}
          />
      </div>
      <div>
        Author:
          <input
            value={newBlog.author}
            name="author"
            onChange={({ target }) => setNewBlog({...newBlog, author: target.value})}
          />
      </div>
      <div>
        Url:
          <input
            type="text"
            value={newBlog.url}
            name="url"
            onChange={({ target }) => setNewBlog({...newBlog, url: target.value})}
          />
      </div>
      <button type="submit">Create</button>
    </form>
  );

  return (
    <div>
      { user === null ?
        <div>
          <h1>Log in to application</h1>
          <Notification message={message} type={messageType} />
          {loginForm()}
        </div>
         : 
        <div>
          <h1>Blogs</h1>
          <h4>Logged in as {user.username} <button onClick={logOut}>Log out</button></h4>
          <Notification message={message} type={messageType} />
          {blogForm()}
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div> 
      }
    </div>
  );
}

export default App;
