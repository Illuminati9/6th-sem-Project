import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, TextField, Button } from "@mui/material";
import { createAnnouncement, fetchClassroomDetails } from "../../middleware/classroomDetailSlice";
import "./styles.css";
import Announcement from "./Announcement";

const Stream = ({ id }) => {
  const dispatch = useDispatch();
  const { classroom, loading, error } = useSelector((state) => state.classroomDetail);
  
  // Local state for input even though global state is handled via Redux for fetching and posting announcements
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(fetchClassroomDetails(id));
  }, [dispatch, id]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handlePostAnnouncement = () => {
    if (!inputValue.trim()) return; // Avoid empty posts
    // const formData = new FormData();
    // formData.append("content", inputValue);
    // formData.append("classroomId", classroom._id);
    // if (image) formData.append("image", image);
    const formData = {
      content: inputValue,
      classroomId: classroom._id};
    dispatch(createAnnouncement(formData));
    
    // Reset local states after posting
    setInputValue("");
    setImage(null);
    setShowInput(false);
  };

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
                          {/* <input
                            onChange={handleFileChange}
                            variant="outlined"
                            color="primary"
                            type="file"
                          /> */}
    
                          <div>
                            <Button onClick={() => setShowInput(false)}>
                              Cancel
                            </Button>
    
                            <Button
                              onClick={handlePostAnnouncement}
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
                <Announcement classroom={classroom} />
              </div>
            </div>
          </div>
  );
};

export default Stream;