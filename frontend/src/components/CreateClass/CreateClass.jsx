import React from "react";
import { useLocalContext } from "../../context/context";
import { Dialog, DialogContent, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles"; 

const useStyles = makeStyles({
  title: {
    padding: "16px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  content: {
    padding: "16px",
  },
});

export default function CreateClass() {
  const { state, setState } = useLocalContext();
  const classes = useStyles(); // Define classes

  return (
    <Dialog
      onClose={() => setState(false)}
      aria-labelledby="simple-dialog-title"
      open={state}
    >
      <Typography className={classes.title}>
        Using a form to create a class?
      </Typography>
      <DialogContent className={classes.content}>
        <div className={classes.text}>
          <p>This is the class room of google</p>
          <a href="/help" className={classes.link1}>
            heyyyyyyyyy
          </a>
           and this our project
          <a href="/learn" className={classes.link2}> Learn more</a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
