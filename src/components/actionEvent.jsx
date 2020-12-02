import React, { useEffect, useState } from "react";
import "../styles/actionevent.scss";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import _ from "lodash";
import { Dialpad, Person, Warning } from "@material-ui/icons";
import Axios from "axios";
import back_url from "../secret";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";

function VerificationEvent({
  back,
  id,
  loading,
  setloading,
  data,
  setData,
  index,
}) {
  const [transactionRecord, setTransactionRecord] = useState([
    {
      id: Math.ceil(Math.random() * 129),
      date: null,
      amount: "",
      type: "transfer",
      to: "",
    },
    {
      id: Math.ceil(Math.random() * 129),
      date: null,
      amount: "",
      type: "withdrawal",
      to: "",
    },
    {
      id: Math.ceil(Math.random() * 129),
      date: null,
      amount: "",
      type: "deposit",
      to: "",
    },
  ]);
  const [VerificationDate, setVerificationDate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setloading(true);
    await Axios({
      method: "POST",
      url: `${back_url}/account/verify`,
      data: {
        id: id,
        transactions: transactionRecord,
        date_of_creation: VerificationDate,
      },
    })
      .then(() => {
        let account_dets = _.cloneDeep(data);
        let dataInUse = data;
        let removed = _.remove(dataInUse, { id });
        _.set(removed[0], "verified", true);
        _.set(removed[0], "date_of_creation", VerificationDate);
        account_dets[index] = removed[0];
        setData(account_dets);
        toast.success("verified");
      })
      .catch(() => {
        toast.error("NetWork Error!");
      })
      .finally(() => {
        setloading(false);
        back();
      });
  };

  return (
    <>
      <h3 className="title">Verification Form.</h3>
      <form onSubmit={handleSubmit}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            className="inputBox date"
            variant="inline"
            inputVariant="outlined"
            format="MM/yyyy"
            placeholder="MM/YYYY"
            margin="normal"
            required
            id="VerificationDate"
            label="Verification Date"
            value={VerificationDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            onChange={(date) => {
              setVerificationDate(Date.parse(date));
            }}
          />
        </MuiPickersUtilsProvider>

        {transactionRecord.map((transBlock, index) => {
          return (
            <div className="transBlock" key={transBlock.id}>
              <Typography variant="caption">{index + 1}.</Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  className="inputBox date"
                  variant="inline"
                  inputVariant="outlined"
                  format="MM/yyyy"
                  margin="normal"
                  placeholder="MM/YYYY"
                  required
                  id="TransactionDate"
                  label="Transaction Date"
                  value={transBlock.date}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  onChange={(date_) => {
                    let date = Date.parse(date_);
                    let transP = _.cloneDeep(transactionRecord);
                    let transB = transactionRecord;
                    let removed = _.remove(transB, {
                      id: transBlock.id,
                    });
                    _.set(removed[0], "date", date);
                    transP[index] = removed[0];
                    setTransactionRecord([...transP]);
                  }}
                />
              </MuiPickersUtilsProvider>
              <TextField
                variant="outlined"
                className="inputBox"
                label="Amount"
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{ color: "#3451f1" }}
                    >
                      <Dialpad />
                    </InputAdornment>
                  ),
                }}
                type="number"
                value={transBlock.amount}
                onChange={(e) => {
                  let transP = _.cloneDeep(transactionRecord);
                  let transB = transactionRecord;
                  let removed = _.remove(transB, { id: transBlock.id });
                  _.set(removed[0], "amount", e.target.value);
                  transP[index] = removed[0];
                  setTransactionRecord([...transP]);
                }}
                placeholder="digit only"
                required
              />
              <FormControl className="inputBox select">
                <InputLabel htmlFor="transaction_type">
                  Transaction Type
                </InputLabel>
                <Select
                  inputProps={{
                    id: "transaction_type",
                  }}
                  variant="outlined"
                  required
                  value={transBlock.type}
                  onChange={(e) => {
                    let transP = _.cloneDeep(transactionRecord);
                    let transB = transactionRecord;
                    let removed = _.remove(transB, {
                      id: transBlock.id,
                    });
                    _.set(removed[0], "type", e.target.value);
                    transP[index] = removed[0];

                    setTransactionRecord([...transP]);
                  }}
                >
                  <MenuItem value="transfer">Transfer</MenuItem>
                  <MenuItem value="withdrawal">Withdraw</MenuItem>
                  <MenuItem value="deposit">Deposite</MenuItem>
                </Select>
              </FormControl>
              {transBlock.type === "deposit" ||
              transBlock.type === "withdrawal" ? (
                <></>
              ) : (
                <TextField
                  variant="outlined"
                  className="inputBox"
                  label="To/From"
                  value={transBlock.to}
                  onChange={(e) => {
                    let transP = _.cloneDeep(transactionRecord);
                    let transB = transactionRecord;
                    let removed = _.remove(transB, { id: transBlock.id });
                    _.set(removed[0], "to", e.target.value);
                    transP[index] = removed[0];

                    setTransactionRecord([...transP]);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ color: "#3451f1" }}
                      >
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  type="text"
                  placeholder="First Last Other"
                  required
                />
              )}
            </div>
          );
        })}
        <div className="btns">
          <Button
            className="btn_"
            style={{ backgroundColor: "#ff3c3c" }}
            onClick={() => {
              let blocks = _.cloneDeep(transactionRecord);
              blocks.pop();
              setTransactionRecord(blocks);
            }}
          >
            remove block
          </Button>
          <Button
            className="btn_"
            style={{ backgroundColor: "#00da3d" }}
            onClick={() => {
              let blocks = _.cloneDeep(transactionRecord);
              blocks.push({
                id: Math.ceil(Math.random() * 129),
                date: null,
                amount: "",
                type: "transfer",
                to: "",
              });
              setTransactionRecord(blocks);
            }}
          >
            add block
          </Button>
        </div>
        <div className="btns">
          <Button className="btn_" onClick={back}>
            cancel
          </Button>
          <Button className="btn_" type="submit">
            {loading ? <ScaleLoader color="white" /> : "verify"}
          </Button>
        </div>
      </form>
    </>
  );
}
function TransactionEvent({
  back,
  id,
  loading,
  setloading,
  data,
  setData,
  index,
}) {
  const [transactionDate, setTransactionDate] = useState(Date.now());
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionTo, setTransactionTo] = useState("");
  const [transactionType, setTransactionType] = useState("");
  console.log(data);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setloading(true);
    await Axios({
      method: "POST",
      url: `${back_url}/account/transaction/update`,
      data: {
        id,
        transactionDate,
        transactionAmount,
        transactionTo,
        transactionType,
      },
    })
      .then(() => {
        try {
          let account_dets = _.cloneDeep(data);
          let dataInUse = data;
          let removed = _.remove(dataInUse, { id });
          _.set(
            removed[0],
            "cash",
            transactionType === "transfer" || transactionType === "withdraw"
              ? parseInt(
                  account_dets[index].cash.replace("$", "").replace("£", "", 10)
                ) - parseInt(transactionAmount, 10)
              : parseInt(
                  account_dets[index].cash.replace("$", "").replace("£", "", 10)
                ) + parseInt(transactionAmount, 10)
          );
          account_dets[index] = removed[0];
          setData(account_dets);
        } catch (error) {
          console.log(error);
        }
        toast.success("Transaction Successful");
      })
      .catch(() => {
        toast.error("NetWork Error!");
      })
      .finally(() => {
        setloading(false);
        back();
      });
  };
  return (
    <>
      <h3 className="title">Transform Form.</h3>
      <form onSubmit={handleSubmit}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            className="inputBox date"
            variant="inline"
            inputVariant="outlined"
            format="MM/yyyy"
            margin="normal"
            required
            id="TransactionDate"
            label="Transaction Date"
            value={transactionDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            onChange={(date) => {
              setTransactionDate(date);
            }}
          />
        </MuiPickersUtilsProvider>
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
          type="number"
          value={transactionAmount}
          onChange={(e) => {
            try {
              setTransactionAmount(
                parseInt(e.target.value, 10) === NaN
                  ? transactionAmount
                  : parseInt(e.target.value, 10)
              );
            } catch (error) {
              console.log(error);
            }
          }}
          placeholder="digit only"
          required
        />
        <FormControl className="inputBox select">
          <InputLabel htmlFor="transaction_type">Transaction Type</InputLabel>
          <Select
            inputProps={{
              id: "transaction_type",
            }}
            variant="outlined"
            required
            value={transactionType}
            onChange={(e) => {
              setTransactionType(e.target.value);
            }}
          >
            <MenuItem value="transfer">Transfer</MenuItem>
            <MenuItem value="withdrawal">Withdraw</MenuItem>
            <MenuItem value="deposit">Deposite</MenuItem>
          </Select>
        </FormControl>
        {transactionType === "deposit" || transactionType === "withdrawal" ? (
          <></>
        ) : (
          <TextField
            variant="outlined"
            className="inputBox"
            label="To/From"
            value={transactionTo}
            onChange={(e) => {
              setTransactionTo(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ color: "#3451f1" }}>
                  <Person />
                </InputAdornment>
              ),
            }}
            type="text"
            placeholder="First Last Other Names"
            required
          />
        )}
        <div className="btns">
          <Button className="btn_" onClick={back}>
            cancel
          </Button>
          <Button className="btn_" type="submit">
            {loading? <ScaleLoader color="white" /> : transactionType}
          </Button>
        </div>
      </form>
    </>
  );
}
function HideEvent({ back, id, loading, setloading, data, setData, index }) {
  const handleHide = async () => {
    if (loading) return;
    setloading(true);
    await Axios({
      method: "GET",
      url: `${back_url}/data/short?action=hide&value=${!data[index]
        .hidden}&id=${id}`,
    })
      .then(() => {
        let account_dets = _.cloneDeep(data);
        let dataInUse = data;
        let removed = _.remove(dataInUse, { id });
        _.set(removed[0], "hidden", !account_dets[index].hidden);
        account_dets[index] = removed[0];
        setData(account_dets);
        toast.success(!account_dets[index].hidden ? "Opened!" : "Hidden!");
      })
      .catch(() => {
        toast.error("NetWork Error!");
      })
      .finally(() => {
        setloading(false);
        back();
      });
  };
  return (
    <div className="Confirm">
      <Warning className="icon_" />
      <div className="txt">
        Are you sure you want continue with this action on this account?
      </div>
      <div className="btns">
        <Button
          className="btn_"
          onClick={() => {
            handleHide();
          }}
        >
          {loading ? <ScaleLoader color="white" /> : "yes"}
        </Button>
        <Button
          className="btn_"
          onClick={() => {
            back();
          }}
        >
          no
        </Button>
      </div>
    </div>
  );
}
function LockEvent({ back, id, loading, setloading, data, setData, index }) {
  const handleLock = async () => {
    if (loading) return;
    setloading(true);
    await Axios({
      method: "GET",
      url: `${back_url}/data/short?action=lock&value=${!data[index]
        .locked}&id=${id}`,
    })
      .then(() => {
        let account_dets = _.cloneDeep(data);
        let dataInUse = data;
        let removed = _.remove(dataInUse, { id });
        _.set(removed[0], "locked", !account_dets[index].locked);
        account_dets[index] = removed[0];
        setData(account_dets);
        toast.success(!account_dets[index].locked ? "Unlocked!" : "Locked!");
      })
      .catch(() => {
        toast.error("NetWork Error!");
      })
      .finally(() => {
        setloading(false);
        back();
      });
  };
  return (
    <div className="Confirm">
      <Warning className="icon_" />
      <div className="txt">
        Are you sure you want continue with this action on this account?
      </div>
      <div className="btns">
        <Button
          className="btn_"
          onClick={() => {
            handleLock();
          }}
        >
          {loading ? <ScaleLoader color="white" /> : "yes"}
        </Button>
        <Button
          className="btn_"
          onClick={() => {
            back();
          }}
        >
          no
        </Button>
      </div>
    </div>
  );
}
function DeleteEvent({ back, id, loading, setloading, data, setData }) {
  const handleDelete = async () => {
    if (loading) return;
    setloading(true);
    await Axios({
      method: "GET",
      url: `${back_url}/data/short?action=delete&value=null&id=${id}`,
    })
      .then(() => {
        let account_dets = data;
        _.remove(account_dets, { id });
        setData(account_dets);
        toast.success("Deleted!");
      })
      .catch(() => {
        toast.error("NetWork Error!");
      })
      .finally(() => {
        setloading(false);
        back();
      });
  };
  return (
    <div className="Confirm">
      <Warning className="icon_" />
      <div className="txt">
        Are you sure you want continue with this action on this account?
      </div>
      <div className="btns">
        <Button
          className="btn_"
          onClick={() => {
            handleDelete();
          }}
        >
          yes
        </Button>
        <Button
          className="btn_"
          onClick={() => {
            back();
          }}
        >
          no
        </Button>
      </div>
    </div>
  );
}

export default function ActionEvent({
  action,
  id,
  back,
  data,
  setData,
  index,
}) {
  const [loading, setloading] = useState(false);
  return (
    <div
      className={action !== "" ? "ActionEvent active" : "ActionEvent"}
      onClick={(e) => {
        if (typeof e.target.className !== "string") return;
        if (!e.target.className.includes("ActionEvent")) return;
        back();
      }}
    >
      <div className="container">
        {action === "verify" ? (
          <VerificationEvent
            id={id}
            back={
              loading
                ? () => {
                    console.log("");
                  }
                : back
            }
            loading={loading}
            setloading={setloading}
            data={data}
            index={index}
            setData={setData}
          />
        ) : action === "transaction" ? (
          <TransactionEvent
            id={id}
            index={index}
            back={
              loading
                ? () => {
                    return;
                  }
                : back
            }
            setData={setData}
            data={data}
            loading={loading}
            setloading={setloading}
          />
        ) : action === "hide" ? (
          <HideEvent
            id={id}
            back={
              loading
                ? () => {
                    console.log("");
                  }
                : back
            }
            index={index}
            loading={loading}
            setloading={setloading}
            data={data}
            setData={setData}
          />
        ) : action === "lock" ? (
          <LockEvent
            id={id}
            back={
              loading
                ? () => {
                    console.log("");
                  }
                : back
            }
            loading={loading}
            setloading={setloading}
            data={data}
            index={index}
            setData={setData}
          />
        ) : action === "delete" ? (
          <DeleteEvent
            id={id}
            back={
              loading
                ? () => {
                    console.log("");
                  }
                : back
            }
            loading={loading}
            setloading={setloading}
            data={data}
            index={index}
            setData={setData}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
