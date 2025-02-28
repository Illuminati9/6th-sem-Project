import React, { useState } from "react";
import { useLocalContext } from "../../context/context";
import { Dialog, DialogContent, Typography, Checkbox, DialogActions, Button, FormControlLabel } from "@mui/material";
import { makeStyles } from "@mui/styles"; 
import './style.css';
import Form from "./Form";

const useStyles = makeStyles({
  title: {
    padding: "16px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  content: {
    padding: "16px",
  },
  checkbox: {
    marginTop: "10px",
  },
});

export default function CreateClass() {
  const classes = useStyles(); 
  const { state, setState } = useLocalContext(); 
  const [check, setCheck] = useState(false);
  const [form, setForm] = useState(false);  

  const handleChange = () => {
    setCheck(!check);
  };

  return (
    <Dialog
      onClose={() => setState(false)}
      aria-labelledby="simple-dialog-title"
      open={state}
      maxWidth={form ? "md" : "xs"}
      fullWidth
    >
      {form ? (
        <Form setForm={setForm} />  
      ) : (
        <>
          <Typography className={classes.title}>
            Using a form to create a class?
          </Typography>
          <DialogContent className={classes.content}>
            <div>
              <p>This is the class room of Google</p>
              <a href="/help" className="link1">Heyyyyyyyyy</a> and this is our project
              <a href="/learn" className="link2"> Learn more</a>
            </div>
            <div className={classes.checkbox}>
              <FormControlLabel
                control={<Checkbox onChange={handleChange} checked={check} />}
                label="I understand"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setState(false)} color="default">  
              Close
            </Button>
            <Button disabled={!check} color="primary" onClick={() => setForm(true)}>  
              Continue
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
