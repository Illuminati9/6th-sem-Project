//// filepath: /Users/sridhar/Sridhar/Personal/Acads/6th-sen-frontend-new/src/components/classroomDetailElements/Announcement.jsx
import React, { useEffect } from "react";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnnouncements } from "../../middleware/announcementSlice";
import "./styles.css";

const Announcement = ({ classroom }) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.announcement);

  useEffect(() => {
    if (classroom && classroom._id) {
      dispatch(fetchAnnouncements(classroom._id));
    }
  }, [dispatch, classroom]);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;
  if (comments.length === 0) return <div>No comments available</div>;

  return (
    <div>
      {comments.map((item) => (
        <div className="amt" key={item._id}>
          <div className="amt__Cnt">
            <div className="amt__top">
              <Avatar />
              <div>{item.createdBy?.name || "Anonymous"}</div>
            </div>
            <p className="amt__txt">{item.content}</p>
            {item.imageUrl && (
              <img className="amt__img" src={item.imageUrl} alt="Announcement Content" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Announcement;