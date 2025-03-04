import React, { useState } from "react";
import { useLocalContext } from "../../context/context";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Close from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import axios from "axios";
import "./style.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const JoinClass = () => {
  const { join, setJoin } = useLocalContext();
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinClass = async () => {
    if (!classCode.trim()) {
      setError("Please enter a class code");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await axios.post(
        `http://localhost:8000/api/classroom/join/${classCode}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setJoin(false);
        if (window.confirm('Successfully joined the classroom! Reload page to see changes?')) {
          window.location.reload();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join classroom");
    } finally {
      setLoading(false);
    }
  };

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
            <h3 className="joinClass__topHead">Join Class</h3>
          </div>
          <Button
            className="joinClass__btn"
            variant="contained"
            color="primary"
            onClick={handleJoinClass}
            disabled={loading || !classCode.trim()}
          >
            {loading ? "Joining..." : "Join"}
          </Button>
        </div>

        {error && (
          <div style={{ color: "red", textAlign: "center", margin: "10px" }}>
            {error}
          </div>
        )}

        <div className="joinClass__form">
          <p className="joinClass__formtext">
            You are about to join a classroom
          </p>
          <div className="joinClass__loginInfo">
            <div className="joinClass__classLeft">
              <Avatar />
              <div className="joinClass__loginText">
                <div className="joinClass__loginName">
                  {localStorage.getItem('username')}
                </div>
                <div className="joinClass__loginEmail">
                  {localStorage.getItem('email')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="joinClass__form">
          <div
            style={{ color: "#3c4043", fontSize: "1.25rem" }}
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
              value={classCode}
              onChange={(e) => {
                setClassCode(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default JoinClass;