import { useState } from "react";
import ReactDOM from "react-dom/client";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Register = () => {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  async function fetchData() {
    const user = {
      name: inputs.name,
      username: inputs.username,
      email: inputs.email,
      phone: inputs.phone,
      website: inputs.website,
      rank: inputs.rank,
      api_key: inputs.api_key,
    };

    console.log(user.username);

    try {
      const response = await fetch(`http://localhost:3000/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      console.log(data);
      console.log(data[0]);

      const password = {
        username: inputs.username,
        password: inputs.password,
      };

      const passwordResponse = await fetch(
        `http://localhost:3000/api/users/${inputs.username}/password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(password),
        }
      );

      const passwordData = await passwordResponse.json();
      console.log(passwordData);
      navigate(`/Login`);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    if (inputs.password !== inputs.validationPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    fetchData();
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign up</h1>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={inputs.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={inputs.email || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={inputs.phone || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="website">Website:</label>
          <input
            type="text"
            id="website"
            name="website"
            value={inputs.website || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rank">Rank:</label>
          <input
            type="text"
            id="rank"
            name="rank"
            value={inputs.rank || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="api_key">Api key:</label>
          <input
            type="text"
            id="api_key"
            name="api_key"
            value={inputs.api_key || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={inputs.username || ""}
            onChange={handleChange}
            required
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
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Validation Password:</label>
          <input
            type="password"
            id="validationPassword"
            name="validationPassword"
            value={inputs.validationPassword || ""}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Register;
