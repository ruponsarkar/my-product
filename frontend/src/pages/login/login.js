import React, { useState } from "react";
import axios from "axios";
import { loginAPI } from "../../api/services/auth/login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
    //   const res = await axios.post("http://localhost:4000/api/auth/login", {
    //     email,
    //     password,
    //   });

      const res = await loginAPI({email, password});
      console.log("response", res);

      // backend returns { token, user }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful");
      console.log("Logged in user:", res.data.user);

      // example redirect
      // window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleLogin}>
        <div className="mb-3 col-md-6">
          <input
            type="email"
            placeholder="Enter your email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 col-md-6">
          <input
            type="password"
            placeholder="Enter your password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <div className="mb-3">
          <button type="submit" className="btn btn-primary btn-sm">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
