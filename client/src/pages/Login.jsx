import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();

    try {
      const res = await api.post("/login", {
        username,
        password,
      });

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid username or password");
    }
  }

  return (
    <div className="login-page">

      <form className="login-card" onSubmit={login}>

        <h1>SecureSentinel</h1>

        <p>Administrator Login</p>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Sign In
        </button>

      </form>

    </div>
  );
}

export default Login;