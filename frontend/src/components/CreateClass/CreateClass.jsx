
import { useState } from "react";
import { useLocalContext } from "../../context/context";
import { Dialog, DialogContent, Typography, Checkbox, DialogActions, Button, FormControlLabel } from "@mui/material";
import { makeStyles } from "@mui/styles"; 
import './style.css';
import Form from "./Form";

const useStyles = makeStyles({
  title: {
    padding: "16px",
    fontSize: "24px", 
    fontWeight: "500",
    color: "#1a73e8", 
  },
  content: {
    padding: "24px",
    backgroundColor: "#f8f9fa",
  },
  checkbox: {
    marginTop: "15px",
  },
  dialogPaper: {
    borderRadius: "12px",
  }
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
      aria-labelledby="create-class-dialog"
      open={state}
      maxWidth={form ? "md" : "xs"}
      fullWidth
      PaperProps={{
        className: classes.dialogPaper
      }}
    >
      {form ? (
        <Form setForm={setForm} setState={setState} />  
      ) : (
        <>
          <Typography className={classes.title}>
            Create a New Classroom
          </Typography>
          <DialogContent className={classes.content}>
            <div>
              <p className="create-class-description">
                Create a virtual classroom to manage assignments, collaborate with students, 
                and organize learning materials effectively.
              </p>
            </div>
            <div className={classes.checkbox}>
              <FormControlLabel
                control={
                  <Checkbox 
                    onChange={handleChange} 
                    checked={check}
                    color="primary" 
                  />
                }
                label="I understand and agree to the terms"
              />
            </div>
          </DialogContent>
          <DialogActions style={{ padding: "16px" }}>
            <Button 
              onClick={() => setState(false)} 
              style={{ color: "#5f6368" }}
            >  
              Cancel
            </Button>
            <Button 
              disabled={!check} 
              variant="contained"
              color="primary" 
              onClick={() => setForm(true)}
            >  
              Continue
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}