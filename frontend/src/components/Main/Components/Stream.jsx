import React from "react";
import axios from "axios";
import { Avatar, TextField, Button } from "@mui/material";
import "../styles.css";
import { useState,useEffect } from "react";
import Announcment from "../../Announcement/Announcement";


const stream = ({id}) => {
    const [classroom, setClassroom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInput] = useState("");
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    };

    const handleUpload = async () => {  
      const formData = {
        content: inputValue,
        classroomId: classroom._id,
        image: image,
      };
      console.log(formData)
      try {
        const res = await axios.post(
          "http://localhost:8000/api/comment/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res.data);
        setInput("");
        setImage(null);
        setShowInput(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to upload");
      }
    };
    const handleInputChange = (e) => {
      setInput(e.target.value);
    };

    useEffect(() => {
        const fetchClassroom = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/classroom/info/${id}`,
                    {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    }
                );
                console.log(res.data)
                console.log(res.data.classroom)
                localStorage.setItem("classroomInstructor",res.data.classroom.instructor._id);
                setClassroom(res.data.classroom);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch classroom");
            } finally {
                setLoading(false);
            }
        };
        
        fetchClassroom();
    }, []);

    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!classroom) return <div>Classroom not found</div>;

    return (
        <div className="main__wrapper">
            <div className="main__content">
              <div className="main__wrapper1">
                <div className="main__bgImage">
                  <div className="main__emptyStyles" />
                </div>
                <div className="main__text">
                  <h1 className="main__heading main__overflow">
                    {classroom?.name}
                  </h1>
                  <div className="main__section main__overflow">
                    {classroom?.section}
                  </div>
                  <div className="main__wrapper2">
                    <em className="main__code">Class Code :</em>
                    <div className="main__id">{classroom.classroomCode}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="main__announce">
              <div className="main__status">
                <p>Upcoming</p>
                <p className="main__subText">No work due</p>
              </div>
              <div className="main__announcements">
                <div className="main__announcementsWrapper">
                  <div className="main__ancContent">
                    {showInput ? (
                      <div className="main__form">
                        <TextField
                          id="filled-multiline-flexible"
                          multiline
                          label="Announce Something to class"
                          variant="filled"
                          value={inputValue}
                          onChange={handleInputChange}
                        />
                        <div className="main__buttons">
                          <input
                            onChange={handleChange}
                            variant="outlined"
                            color="primary"
                            type="file"
                          />
    
                          <div>
                            <Button onClick={() => setShowInput(false)}>
                              Cancel
                            </Button>
    
                            <Button
                              onClick={handleUpload}
                              color="primary"
                              variant="contained"
                            >
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="main__wrapper100"
                        onClick={() => setShowInput(true)}
                      >
                        <Avatar />
                        <div>Announce Something to class</div>
                      </div>
                    )}
                  </div>
                </div>
                <Announcment classroom={classroom} />
              </div>
            </div>
          </div>
    );
}

export default stream;