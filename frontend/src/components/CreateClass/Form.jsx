import { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  form: {
    padding: "30px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "500",
    color: "#1a73e8",
    marginBottom: "20px",
  },
  formContent: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  buttonGroup: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  }
});

const Form = ({ setForm, setState }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Class name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await axios.post("http://localhost:8000/api/classroom/create", formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setState(false);
        if (window.confirm('Classroom created successfully! Reload page to see changes?')) {
          window.location.reload();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create classroom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.form}>
      <p className={classes.title}>Create Classroom</p>
      {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
      <div className={classes.formContent}>
        <TextField
          name="name"
          label="Class Name"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          helperText="Enter a unique name for your classroom"
          error={!formData.name && error}
        />
        <TextField
          name="subject"
          label="Subject"
          variant="outlined"
          fullWidth
          value={formData.subject}
          onChange={handleChange}
          required
          helperText="Enter the subject for this class"
        />
        <TextField
          name="description"
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
          helperText="Provide a brief description of the class"
        />
      </div>
      <div className={classes.buttonGroup}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setForm(false)}
          disabled={loading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !formData.name.trim()}
        >
          {loading ? <CircularProgress size={24} /> : "Create Classroom"}
        </Button>
      </div>
    </div>
  );
};

Form.propTypes = {
  setForm: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
};

export default Form;