import { Outlet, Link } from "react-router-dom";
import "./Users.css";

const Users = () => {
  var user = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <div className="users-container">
      <h1 className="user-name">{user.name}</h1>
      <Link to="/Login">
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("currentUser");
          }}
        >
          Logout
        </button>
      </Link>
      <nav className="user-navigation">
        <ul>
          <li>
            <Link to={`/Users/${user.id}/Posts`}>Posts</Link>
          </li>
          <li>
            <Link to={`/Users/${user.id}/Todos`}>Todos</Link>
          </li>
          <li>
            <Link to={`/Users/${user.id}/Info`}>Info</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default Users;
