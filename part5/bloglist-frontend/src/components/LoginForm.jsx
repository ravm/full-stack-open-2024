import PropTypes from "prop-types";

const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        Username
        <input
          type="text"
          value={username}
          name="username"
          data-testid="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          name="password"
          data-testid="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
};

export default LoginForm;
