import React, { useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from "@material-ui/core";
import { Lock, Mail, Visibility, VisibilityOff } from "@material-ui/icons";
import { ScaleLoader } from "react-spinners";
import "../styles/login.scss";
import moment from "moment";
import { Helmet } from "react-helmet";
import Axios from "axios";
import back_url from "../secret";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [email_error, setemail_error] = useState(false);
  const [password_error, setpassword_error] = useState(false);
  const [visibility_state, setvisibility_state] = useState("");
  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    setloading(true);
    Axios({
      method: "GET",
      url: `${back_url}/account/admin/login?email=${email}&password=${password}`,
    })
      .then(({ data }) => {
        localStorage.setItem("admin", JSON.stringify(true));
        setOpen(true);
      })
      .catch((err) => { 
        if (err.message === "Request failed with status code 400") {
          setemail_error(true);
        }
        if (err.message === "Request failed with status code 402") {
          setpassword_error(true);
        }
      })
      .finally(() => {
        setloading(false);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      window.location.reload();
      return;
    }
    window.location.reload();
    setOpen(false);
  };

  return (
    <div className="Login">
      <Helmet>
        <title>
          Skylite Bank :: Admin Login - Personal & Business Banking - Student, Auto &
          Home Loans - Investing & Insurance
        </title>
      </Helmet>
      <div className="container">
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Login successful!
          </Alert>
        </Snackbar>
        <form onSubmit={handleSubmit}>
          <h3>admin login</h3>
          <p className="txt">welcome back the to easy in transaction.</p>
          <TextField
            label="email"
            id="email"
            variant="outlined"
            placeholder="your-mail@example.com"
            type="email"
            className="inputBox"
            value={email}
            error={email_error}
            helperText={email_error ? "Incorrect email" : ""}
            onChange={(e) => {
              if (email_error) {
                setemail_error(false);
              }
              setemail(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment className="inputBox_icon" position="start">
                  <Mail />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            id="password"
            variant="outlined"
            placeholder="secret"
            type={visibility_state ? "text" : "password"}
            className="inputBox"
            value={password}
            error={password_error}
            helperText={password_error ? "Incorrect password" : ""}
            onChange={(e) => {
              if (password_error) {
                setpassword_error(false);
              }
              setpassword(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment className="inputBox_icon" position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment className="inputBox_icon" position="end">
                  <IconButton
                    onClick={() => {
                      setvisibility_state(!visibility_state);
                    }}
                  >
                    {visibility_state ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" className={loading ? "btn_ active" : "btn_"}>
            {loading ? <ScaleLoader color="white" /> : "submit"}
          </Button>
          <p className="txt_">
            Don't have an account?{" "}
            <a
              href="https://skylitebank.com/account-opening.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              create one.
            </a>
          </p>
        </form>
      </div>
      <footer>
        &copy; Copyright {moment().format("YYYY")}
        <strong>skylitebank</strong> PLC. All right reserver
      </footer>
    </div>
  );
}
