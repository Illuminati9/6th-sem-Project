import React from "react";
import Avatar  from "@mui/material/Avatar";
import FolderOpen from "@mui/icons-material/FolderOpen";
import PermContactCalendar from "@mui/icons-material/PermContactCalendar";
// import { Link } from "react-router-dom";
import "./style.css";

const JoinedClasses = ({ classData }) => {
  return (
    <li className="joined__list">
      <div className="joined__wrapper">
        <div className="joined__container">
          <div className="joined__imgWrapper" />
          <div className="joined__image" />
          <div className="joined__content">
            {/* <Link className="joined__title" to={`/classroom/${classData?.classroomCode}`} >
              <h2>{classData?.name}</h2>
            </Link> */}
            <div className="joined__title">
              <a href={`/classroom/${classData?.classroomCode}`}>
              <h2>{classData?.name}</h2>
              </a>
            </div>
            <p className="joined__owner">{classData?.instructor}</p>
          </div>
        </div>
        <Avatar
          className="joined__avatar"
          src="https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s75-c-fbw=1/photo.jpg"
        />
      </div>
      <div className="joined__bottom">
        <PermContactCalendar />
        <FolderOpen />
      </div>
    </li>
  );
};

export default JoinedClasses;