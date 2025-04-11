import React from "react";
import Landing from "./pages/landing/app";
import AuthForm from "./pages/auth/app";
import Layout from "./layout";
import Home from "./pages/home/app";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ClassroomDetail from "./pages/classroomDetailed/app";
import axios from "axios";
import  Assignment  from "./pages/assignment/app";
import { useSelector } from "react-redux";

function App() {

  const {user} = useSelector((state) => state.user);

  const isAuthenticated = () => {
      if (user===null) return false;
      return true;
  };

  const ProtectedRoute = ({ children }) => {
    console.log(isAuthenticated());
    if (!Boolean(isAuthenticated())) {
      return <Navigate to="/landing" />;
    }
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (Boolean(isAuthenticated())) {
      return <Navigate to="/home" />;
    }
    return children;
  }


  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        } />
        <Route path="/signup" element={<AuthForm />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/home/*" element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
          } />
        <Route path="/classroom/:classroomCode/*" element={
        <ProtectedRoute>
          <Layout>
            <ClassroomDetail />
          </Layout>
        </ProtectedRoute>
        }/>

        <Route path='/assignment/:assignmentId' element={
          <ProtectedRoute>
            <Layout>
              <Assignment />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
