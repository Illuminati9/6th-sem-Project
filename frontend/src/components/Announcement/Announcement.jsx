import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

const Announcement = ({ classroom }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.post(
                    "http://localhost:8000/api/comment/get",
                    {
                      classroomId: classroom._id,
                    },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    }
                );
                console.log(classroom?._id);
                console.log(res.data);
                setComments(res.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch comments");
            } finally {
                setLoading(false);
            }
        };
        console.log(classroom._id);
        if(classroom) {
            fetchComments();
        }
        setLoading(false);
    }, []);

    if (loading) return <div>Loading comments...</div>;
    if (error) return <div>Error: {error}</div>;
    if(comments.length === 0) return <div>No comments available</div>;

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
              {item.imageUrl && <img className="amt__img" src={item.imageUrl} alt={item.content} />}
            </div>
          </div>
        ))}
      </div>
    );
};

export default Announcement;