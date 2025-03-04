import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import "./style.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login. Please try again.");
    }
  };

  return (
    <Box className="login">
      <Typography variant="h5" className="login__heading">
        Welcome Back!{" "}
        <span role="img" aria-label="wave">
          👋
        </span>
      </Typography>

      <Box className="login__container">
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            margin="normal"
            size="small"
            label="Email"
            type="email"
            name="email"
            variant="outlined"
            fullWidth
            className="login__input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <TextField
            margin="normal"
            size="small"
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            variant="outlined"
            fullWidth
            className="login__input"
            value={formData.password}
            onChange={handleInputChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" variant="contained" className="login__btn">
            Login Now!
          </Button>
        </form>

        <Box className="login__signup">
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="login__signup-link">
              Sign Up
            </a>
          </Typography>
        </Box>

        <Box className="login__divider">
          <Divider className="login__divider-line" />
          <Typography variant="body2" className="login__divider-text">
            or continue with
          </Typography>
          <Divider className="login__divider-line" />
        </Box>

        <Box className="login__social">
          <Button variant="outlined" startIcon={<GoogleIcon />} className="login__social-btn">
            Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
