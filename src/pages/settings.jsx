import {
  Avatar,
  Button,
  TextField,
  Typography,
  Snackbar,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/profile.scss";
import { ScaleLoader } from "react-spinners";
import Axios from "axios";
import back_url from "../secret";
import MuiAlert from "@material-ui/lab/Alert";
import _ from "lodash";
import { set_details } from "../redux/action/event";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function SettingsPage() {
  const details = useSelector((state) => state.event.details);
  const dispatch = useDispatch();
  const [account_name, setaccount_name] = useState("");
  const [account_email, setaccount_email] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [password, setpassword] = useState("");
  const [confirm_password, setconfirm_password] = useState("");
  const [loading, setloading] = useState(false);
  const [open_suc, setOpen_suc] = useState(false);
  const [open_err, setOpen_err] = useState(false);

  useEffect(() => {
    if (details) {
      try {
        setaccount_name(
          `${details.first_name} ${details.last_name} ${details.other_name}`
        );
        setaccount_email(details.email);
        setphone_number(details.phone_number);
      } catch (error) {}
    }
  }, [details]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    await Axios({
      method: "POST",
      url: `${back_url}/account/settings/set`,
      data: {
        id: details._id,
        account_name,
        account_email,
        phone_number,
        password,
      },
    })
      .then(({ data: { record } }) => {
        setOpen_suc(true);
        try {
          let detailsCopy = details;
          _.set(detailsCopy, "first_name", record.first_name);
          _.set(detailsCopy, "last_name", record.last_name);
          _.set(detailsCopy, "other_name", record.other_name);
          _.set(detailsCopy, "email", record.email);
          _.set(detailsCopy, "phone_number", record.phone_number);

          dispatch(set_details(detailsCopy));
        } catch (e) {
          setOpen_err(true);
          console.log(e);
        }
      })
      .catch(() => {
        setOpen_err(true);
      })
      .finally(() => {
        setloading(false);
      });
  };

  const handleClose = (_event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen_err(false);
    setOpen_suc(false);
  };
  return (
    <div className="Settings Profile">
      <Snackbar open={open_err} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" className="noti_">
          Network Error!
        </Alert>
      </Snackbar>
      <Snackbar open={open_suc} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" className="noti_">
          Successful!
        </Alert>
      </Snackbar>
      <Typography variant="h4" className="title_heading">
        Settings
      </Typography>
      <div className="profile_">
        <span className="title">my details</span>

        <div className="title_">
          <Avatar className="avatar">
            {details.first_name.substr(0, 1).toUpperCase()}
            {details.last_name.substr(0, 1).toUpperCase()}
          </Avatar>
          {details.sex.toLowerCase() === "male" ? "Mr. " : "Mr's. "}
          {details.first_name}
        </div>
        <Typography variant="subtitle2" className="subtitle_">
          Account Number
        </Typography>
        <span className="txt">{details.account_num || ""}</span>
        <Typography variant="subtitle2" className="subtitle_">
          Account Email
        </Typography>
        <span className="txt">{details.email || ""}</span>
      </div>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          className="inputBox"
          required
          label="Account Name"
          placeholder="first last other names"
          value={account_name}
          onChange={(e) => {
            setaccount_name(e.target.value);
          }}
        />
        <TextField
          variant="standard"
          className="inputBox"
          required
          type="email"
          placeholder="abc@xyz.com"
          label="Account Email"
          value={account_email}
          onChange={(e) => {
            setaccount_email(e.target.value);
          }}
        />
        <TextField
          variant="standard"
          className="inputBox"
          required
          label="Phone Number"
          placeholder="country code include e.g +1 USA"
          value={phone_number}
          onChange={(e) => {
            setphone_number(e.target.value);
          }}
        />
        <TextField
          variant="standard"
          className="inputBox"
          required
          label="Password"
          type="password"
          placeholder="SECRET"
          value={password}
          onChange={(e) => {
            setpassword(e.target.value);
          }}
        />
        <TextField
          variant="standard"
          className="inputBox"
          required
          label="Confirm Password"
          placeholder="SECRET"
          type="password"
          value={confirm_password}
          error={password.length >= 1 && password !== confirm_password}
          helperText={
            password.length >= 1 && password !== confirm_password
              ? "Password don't match"
              : ""
          }
          onChange={(e) => {
            setconfirm_password(e.target.value);
          }}
        />
        <Button
          className="btn_"
          type="submit"
          disabled={
            account_name.length < 1 ||
            account_email.length < 1 ||
            phone_number.length < 1 ||
            password.length < 1 ||
            confirm_password.length < 1 ||
            loading === true
          }
        >
          {loading ? <ScaleLoader color="white" /> : "update"}
        </Button>
      </form>
    </div>
  );
}
