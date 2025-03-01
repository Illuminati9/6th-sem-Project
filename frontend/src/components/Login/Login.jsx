import React, { useState } from "react";
import { useLocalContext } from "../../context/context";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import "./style.css";

const Login = () => {
  const { login } = useLocalContext();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box className="login">
      <Typography variant="h5" className="login__heading">
        Hi! Welcome to Wealth Wave dude{" "}
        <span role="img" aria-label="wave">
          👋
        </span>
      </Typography>

      <Box className="login__container">
        <TextField
          margin="normal"
            size="small"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          className="login__input"
        />

        <TextField
          margin="normal"
          size="small"
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          className="login__input"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          variant="contained"
          onClick={login}
          className="login__btn"
        >
          Login Now!
        </Button>

        <Box className="login__signup">
          <Typography variant="body2">
            Don’t have an account?{" "}
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
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            className="login__social-btn"
          >
            Google
          </Button>
          
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
