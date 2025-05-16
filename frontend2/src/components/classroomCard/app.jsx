import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Box,
  Divider
} from "@mui/material";
import { MoreVert, AssignmentIndOutlined, FolderOpenOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

const JoinedClassCard = ({
  classroom,
}) => {
  const avatarUrl = "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s75-c-fbw=1/photo.jpg"
  const subtitle = "CS + IT + M.Tech + PhD"

  return (
    <Link to={`/classroom/${classroom.classroomCode}`} style={{ textDecoration: 'none' }}>
    <Card
      sx={{
        width: "300px",
        height: '300px',
        borderRadius: 2,
        position: "relative",
        boxShadow: "none",
        border: "1px solid #e0e0e0",
      }}
    >
      <Box
        sx={{
          position: "relative",
          backgroundImage: `url("https://gstatic.com/classroom/themes/Physics.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 100,
          p: 2
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#fff", fontWeight: 500, pb: 1, lineHeight: 1.2 }}
        >
          {classroom.name}
        </Typography>

        <Typography
          // variant="h4"
          sx={{ color: "#fff", fontWeight: 500, lineHeight: 1.2 }}
        >
          {classroom.subject}
        </Typography>

        {/* <Typography variant="body2" sx={{ color: "#fff", mt: 0.5, fontSize: 12 }}>
          {subtitle}
        </Typography> */}

        <IconButton
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            color: "#fff"
          }}
          aria-label="menu"
        >
          <MoreVert />
        </IconButton>

        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: 70,
            bottom: 4,
            left: 16,
            color: "#fff",
            fontSize: 12,
          }}
        >
          {classroom.instructor}
        </Typography>

        <Avatar
          src={avatarUrl}
          alt="Instructor Avatar"
          sx={{
            position: "absolute",
            bottom: -28,
            right: 16,
            width: 75,
            height: 75,
            border: "2px solid #fff",
            boxShadow: 1
          }}
        />
      </Box>

      <Box
        sx={{
          height: 137,
        }}
      >
      </Box>

      <Divider />

      <CardContent
        sx={{
          minHeight: 57,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <IconButton aria-label="Assignment">
          <AssignmentIndOutlined sx={{ color: "#000" }} />
        </IconButton>
        <IconButton aria-label="Open Folder">
          <FolderOpenOutlined sx={{ color: "#000" }} />
        </IconButton>
      </CardContent>
    </Card>
    </Link>
  );
};

export default JoinedClassCard;
