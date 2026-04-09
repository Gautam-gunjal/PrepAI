import React, { useState } from "react";
import "../styles/LoginRegister.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, handleLogin, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin({ email, password });
    if (success) {
      navigate("/");
    }
  };

  return (
    <>
      {loading && <Loader />}

      <main className="auth-root">
        <div className="auth-bg-glow auth-bg-glow-1" />
        <div className="auth-bg-glow auth-bg-glow-2" />

        <section className="auth-card">
          <div className="auth-brand">
            <div className="auth-logo">AI</div>
            <div>
              <p className="auth-kicker">Welcome back</p>
              <h1>Login to Continue</h1>
            </div>
          </div>

          <p className="auth-subtitle">
            Sign in for your interview strategy.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button className="SubmitButton" type="submit">
              Login
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </section>
      </main>
    </>
  );
};

export default Login;