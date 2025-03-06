import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Drawer from "../Drawer/drawer";
// import Header from "../Header";
// import ClassroomGrid from "../ClassroomGrid/ClassroomGrid";
// import { LocalContextProvider } from "../../context/context";
import axios from "axios";
// import "./style.css";
import JoinedClasses from "../JoinedClass/joinedclass";
import { Grid } from "@mui/material";

const theme = createTheme();

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [classrooms, setClassrooms] = useState([]);

  useEffect(async() => {
    document.title = "Home";
    await fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.get("http://localhost:8000/api/classroom/getAll", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data.classrooms)
      if (response.data.success) {
        setClassrooms(response.data.classrooms);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch classrooms");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <LocalContextProvider>
      <ThemeProvider theme={theme}>
        {/* <div className="home-container"> */}
          <Drawer />
          <div className="content-wrapper">
            {/* <Header /> */}
            <main className="home-main">
              {loading ? (
                <div className="loading">Loading...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : (
                    <Grid container>
                      {classrooms.map((classData) => (
                        <JoinedClasses key={classData.id} classData={classData} />
                      ))}
                    </Grid>
              )}
            </main>
          </div>
        {/* </div> */}
      </ThemeProvider>
    // </LocalContextProvider>
  );
};

export default Home;