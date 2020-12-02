import React, { useState } from "react";
import { TextField, InputAdornment, Button, Snackbar } from "@material-ui/core";
import "../styles/deposit.scss";
import { Dialpad } from "@material-ui/icons";
import { ScaleLoader } from "react-spinners";
import Axios from "axios";
import back_url from "../secret";
import MuiAlert from "@material-ui/lab/Alert";
import { Link } from "react-router-dom";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const details = JSON.parse(localStorage.getItem("details"));

export default function WithDrawer() {
  const [amount, setamount] = useState("");
  const [open_err, setOpen_err] = useState(false);
  const [open_suc, setOpen_suc] = useState(false);
  const [loading_c, setloading_c] = useState(false);
  const [nofound, setnofound] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading_c) return;
    setloading_c(true);
    await Axios({
      method: "GET",
      url: `${back_url}/withdraw`,
    })
      .then(() => {
        setOpen_suc(true);
      })
      .catch((err) => {
        console.log(err);
        setOpen_err(true);
      })
      .finally(() => {
        setloading_c(false);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen_err(false);
    setOpen_suc(false);
  };

  return (
    <div className="Deposit">
      <Snackbar open={open_err} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Network Error!
        </Alert>
      </Snackbar>
      <Snackbar open={open_suc} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Transaction Error!
        </Alert>
      </Snackbar>
      <div className="container" />
      <form onSubmit={handleSubmit}>
        {!nofound ? (
          <>
            <h3>WithDrawer Form</h3>
            <p className="txt"> A Simple and Easy process</p>
            <TextField
              variant="outlined"
              className="inputBox"
              label="Amount"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ color: "#3451f1" }}>
                    <Dialpad />
                  </InputAdornment>
                ),
              }}
              required
              type="number"
              placeholder="Digits only"
              value={amount}
              onChange={(e) => {
                if (e.target.value.length < 6) {
                  setamount(e.target.value);
                }
              }}
            />
            <Button type="submit" className={loading_c ? "btn_ op" : "btn_"}>
              {loading_c ? <ScaleLoader color="white" /> : "submit"}
            </Button>
          </>
        ) : (
          <>
            <div className="container_">
              <h3 className="title">
                You have insufficient funds in your account
              </h3>
              <span className="img" />
              <p className="txt">
                To withdraw you must have funds in your account.
              </p>
              <Button className="btn_">
                <Link to="/dashboard/deposit">deposit</Link>
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
