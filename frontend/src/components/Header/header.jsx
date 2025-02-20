import React from "react";
import { useStyles } from "./style";
import { AppBar, Toolbar, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Header = () => {

  const classes = useStyles();
  console.log(classes, "hello"); // Debugging, but not needed in production

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar className={classes.toolbar}>
          <div className={classes.headerWrapper}>
            <img
              src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
              alt="Classroom"
            />
            <Typography variant="h6" className={classes.title}>
              Classroom
            </Typography>
          </div>
          <div className={classes.header__wrapper__right}>
            <AddIcon />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
