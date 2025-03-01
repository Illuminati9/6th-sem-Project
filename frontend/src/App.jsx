import React from "react";
import "./App.css";
import Drawer from "./components/Drawer/drawer"
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/Signup/signup";

const theme = createTheme();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ThemeProvider theme={theme}>
              <div className="App">
                <Drawer />
              </div>
            </ThemeProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
