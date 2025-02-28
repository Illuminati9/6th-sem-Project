import React from "react";
import { useStyles } from "./style";
import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Apps from "@mui/icons-material/Apps";
import CreateClass from "../CreateClass/CreateClass";
import JoinClass from "../JoinClass/joinClass";
import { useLocalContext } from "../../context/context";


const Header = ({ children }) => {
  const classes = useStyles();
  const [anchor, setAnchor] = React.useState(null);

  const HandleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const HandleClose = () => {
    setAnchor(null);
  };
  
  const { setState , setJoin} = useLocalContext(); 
  
  const Handlejoin = () => {
    HandleClose();
    setJoin(true);
  }
  const handlecreate = () => {
    HandleClose();  
    setState(true);
  }

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar className={classes.toolbar}>
          <div className={classes.headerWrapper}>
            {children}
            <img
              src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
              alt="Classroom"
            />
            <Typography variant="h6" className={classes.title}>
              Classroom
            </Typography>
          </div>
          <div className={classes.header__wrapper__right}>
            <AddIcon onClick={HandleClick} className={classes.icon} />
            <Apps className={classes.icon}  />
            <Menu
              id="simple-menu"
              anchorEl={anchor}
              keepMounted
              open={Boolean(anchor)}
              onClose={HandleClose}
            >
              <MenuItem onClick={Handlejoin}>Join Class</MenuItem>
              <MenuItem  onClick={handlecreate} >Create Class</MenuItem>
            </Menu>
            <div>
              <Avatar className={classes.icon}  />
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <CreateClass />
      <JoinClass/>
    </div>
  );
};

export default Header;
