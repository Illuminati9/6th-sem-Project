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
import "./style.css"; // Using CSS classes from style.css

const SignUp = () => {
  const { signup } = useLocalContext();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <Box className="signup">
      <Typography variant="h5" className="signup__heading">
        Create Your Account
      </Typography>
      <Box className="signup__container">
        <TextField
          margin="normal"
          size="small"
          label="Full Name"
          variant="outlined"
          fullWidth
          className="signup__input"
        />

        <TextField
          margin="normal"
          size="small"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          className="signup__input"
        />

        <TextField
          margin="normal"
          size="small"
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          className="signup__input"
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

        <TextField
          margin="normal"
          size="small"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          className="signup__input"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleToggleConfirmPassword} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          variant="contained"
          onClick={signup}
        //   fullWidth
          className="signup__btn"
        >
          Sign Up Now!
        </Button>

    
        <Box className="signup__divider">
          <Divider className="signup__divider-line" />
          <Typography variant="body2" className="signup__divider-text">
            or continue with
          </Typography>
          <Divider className="signup__divider-line" />
        </Box>

        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
        //   fullWidth
          className="signup__social-btn"
        >
          Sign Up with Google
        </Button>

        <Box className="signup__login">
          <Typography variant="body2">
            Already have an account?{" "}
            <a href="/login" className="signup__login-link">
              Login
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
