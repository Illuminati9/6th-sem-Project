import React from "react";
import { TextField, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  form: {
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  formContent: {
    marginTop: "10px",
  },
});

const Form = ({ setForm }) => {
  const classes = useStyles();

  return (
    <div className={classes.form}>
      <p className={classes.title}>Create Class</p>
      <div className={classes.formContent}>
        <TextField
          id="filled-basic"
          label="Class Name "
          variant="filled"
          fullWidth
        />
        <TextField
          id="filled-basic"
          label="Section "
          variant="filled"
          fullWidth
        />
        <TextField
          id="filled-basic"
          label="Subject "
          variant="filled"
          fullWidth
        />
        <TextField id="filled-basic" label="Room " variant="filled" fullWidth />
      </div>
      <Button
        onClick={() => setForm(false)}
        color="Black"
        // style={{ marginTop: "10px" }}
      >
        Back
      </Button>
      <Button
        color="Black"
        // style={{ marginTop: "10px" }}
      >
        Create
      </Button>
    </div>
  );
};

export default Form;
