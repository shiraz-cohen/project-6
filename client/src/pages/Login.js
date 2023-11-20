import { useState } from "react";
import ReactDOM from "react-dom/client";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  async function fetchData() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${inputs.username}/password`
      );
      const data = await response.json();
      console.log(data);
      console.log(data[0]["password"]);

      let exist = false;
      console.log(inputs.password);

      if (inputs.password === data[0]["password"]) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/users/${data[0]["username"]}/name`
          );
          const user = await response.json();
          console.log(user);
          console.log(user[0]);

          var json = JSON.stringify(user[0]);
          localStorage.setItem("currentUser", json);
          exist = true;
          navigate(`/Users`);
        } catch (error) {
          console.error(error);
        }
      }

      if (exist === false) {
        alert("Username or password is incorrect");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    fetchData();
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={inputs.username || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={inputs.password || ""}
            onChange={handleChange}
          />
          <br />
          <div class="flex-col-c p-t-10">
            <span class="txt1 p-b-17">Don't have an account? </span>
            <Link to="/Register">Sign up</Link>
          </div>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
