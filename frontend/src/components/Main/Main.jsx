import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Avatar, TextField,Button } from "@mui/material";
import './styles.css'
import Announcment from "../Announcement/Announcement";
import Drawer from "../Drawer/drawer";
import BasicTabs from "./Components/Tabs";

const Main = () => {
    const { id } = useParams();
    console.log(id);
    
    // return (
    //     <div className="p-4">
    //         <h1 className="text-3xl font-bold">{classroom.name}</h1>
    //         <p className="mt-2 text-gray-700">{classroom.description}</p>
    //         {/* You can add more classroom details here */}
    //     </div>
    // );
    
    return (
        <div className="main">
          <Drawer />
          <BasicTabs id={id} />
        </div>
      );
};

export default Main;