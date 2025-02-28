import React from "react";
import { useLocalContext } from "../../context/context";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Close from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import "./style.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const JoinClass = () => {
  const { join, setJoin } = useLocalContext();

  return (
    <Dialog
      fullScreen
      open={join}
      onClose={() => setJoin(false)}
      TransitionComponent={Transition}
    >
      <div className="joinClass">
        <div className="joinClass__wrapper">
          <div className="joinClass__wraper2" onClick={() => setJoin(false)}>
            <Close className="joinClass__svg" />
          <h3 className="joinClass__topHead" >Join Class</h3>
          </div>
          <Button
            className="joinClass__btn"
            variant="contained"
            color="primary"
          >
            Join
          </Button>
        </div>
        <div className="joinClass__form">
          <p className="joinClass__formtext">
            you are about to join the class of Googleclassroom.
          </p>
          <div className="joinClass__loginInfo">
            <div className="joinClass__classLeft">
              <Avatar></Avatar>
              <div className="joinClass__loginText">
                <div className="joinClass__loginName"> Name</div>
                <div className="joinClass__loginEmail">E-Mail</div>
              </div>
            </div>
            <Button variant="outlined" color="primary">
              Logout
            </Button>
          </div>
        </div>
        <div className="joinClass__form">
          <div
            style={{ color: "#3c4043", fontSize: "1.25rem"  }}
            className="joinClass__formtext"
          >
            Class Code
          </div>
          <div
            style={{ color: "#3c4043", marginTop: "5px" }}
            className="joinClass__formtext"
          >
            Ask your teacher for the class code, then enter it here.
          </div>
          <div className="joinClass__loginInfo" style={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Class Code"
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              label="Owner's Email"
              variant="outlined"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default JoinClass;
