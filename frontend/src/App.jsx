import React from "react";
import "./App.css";
import Drawer from "./components/Drawer/drawer";
import { Header } from "./components";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme(); 
function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Drawer />
      </div>
    </ThemeProvider>
  );
}

export default App;
