import "./App.css";
// import Drawer from "./components/Drawer/drawer"
// import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/Signup/signup";
import Home from "./components/Home/home";
import Landing from "./components/Landing/landing";

// const theme = createTheme();

function App() {

  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/landing" />;
    }
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (isAuthenticated()) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/landing" element={<Landing />} />
        {/* <Route 
          path="/" 
          element={
            isAuthenticated() ? (
              <ThemeProvider theme={theme}>
                <div className="App">
                  <Drawer />
                  <Home />
                </div>
              </ThemeProvider>
            ) : (
              <Navigate to="/landing" />
            )
          } 
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
