import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fab,
} from "@material-ui/core";
import "../styles/dashboard.scss";
import moment from "moment";
import Axios from "axios";
import back_url from "../secret";
import _ from "lodash";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AccountBalanceWallet,
  Delete,
  Lock,
  VerifiedUser,
  Block as HiddenIcon,
  LockOpen,
  DoneAll,
} from "@material-ui/icons";
import ActionEvent from "../components/actionEvent";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createBlock(
  name,
  account_number,
  account_type,
  cash,
  dob,
  id,
  locked,
  hidden,
  verified
) {
  return {
    name,
    account_number,
    account_type,
    cash,
    dob,
    id,
    locked,
    hidden,
    verified,
  };
}

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function DashBoard() {
  const classes = useStyles();
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const [data, setdata] = useState([]);
  const [ID, setId] = useState(null);
  const [action, setAction] = useState("");
  const [Index, setIndex] = useState("");
  useEffect(() => {
    Axios({
      method: "GET",
      url: `${back_url}/data`,
    })
      .then(({ data: { account_data } }) => {
        let record = [];
        console.log(account_data);
        account_data.map((account_data_set) => {
          record.push(
            createBlock(
              `${account_data_set.first_name} ${account_data_set.last_name}`,
              account_data_set.account_num,
              account_data_set.account_type,
              `${account_data_set.account_currentcy}${account_data_set.cash}`,
              moment(account_data_set.dob).format("MMMM, Do yyyy"),
              account_data_set._id,
              account_data_set.locked === null ||
                account_data_set.locked === undefined ||
                account_data_set.locked === true
                ? true
                : false,
              account_data_set.hidden === null ||
                account_data_set.hidden === undefined ||
                account_data_set.hidden === true
                ? true
                : false,
              account_data_set.verified === null ||
                account_data_set.verified === undefined ||
                account_data_set.verified === false
                ? false
                : true
            )
          );
        });
        if (JSON.stringify(record) !== JSON.stringify(data)) {
          setdata(record);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setloading(false);
      });
  }, []);

  return (
    <div className="DashBoard">
      <ToastContainer position="top-center" />
      <ActionEvent
        action={action}
        id={ID}
        back={() => {
          setAction("");
        }}
        setData={(Data) => {
          setdata(Data);
        }}
        data={data}
        index={Index}
      />
      <div className="heading">
        <span className="logo" />
      </div>
      <div className="main">
        <TableContainer component={Paper}>
          <Table className="table_" aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Account Number</StyledTableCell>
                <StyledTableCell>Account Type</StyledTableCell>
                <StyledTableCell>Cash</StyledTableCell>
                <StyledTableCell>Date of Birth</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row" className="name">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell>{row.account_number}</StyledTableCell>
                  <StyledTableCell>{row.account_type}</StyledTableCell>
                  <StyledTableCell>{row.cash}</StyledTableCell>
                  <StyledTableCell>{row.dob}</StyledTableCell>
                  <StyledTableCell>
                    <div className="action" title="verify">
                      {row.verified ? (
                        <></>
                      ) : (
                        <Fab
                          className="action_btn verify"
                          onClick={() => {
                            setId(row.id);
                            setAction("verify");
                            setIndex(index);
                          }}
                        >
                          <VerifiedUser />
                        </Fab>
                      )}
                      <Fab
                        className="action_btn wallet"
                        title="transaction"
                        onClick={() => {
                          setId(row.id);
                          setAction("transaction");
                          setIndex(index);
                        }}
                      >
                        <AccountBalanceWallet />
                      </Fab>
                      <Fab
                        className={
                          row.locked
                            ? "action_btn done lock"
                            : "action_btn lock"
                        }
                        title={row.locked ? "unlock" : "lock"}
                        onClick={() => {
                          setId(row.id);
                          setAction("lock");
                          setIndex(index);
                        }}
                      >
                        {row.locked ? <LockOpen /> : <Lock />}
                      </Fab>
                      <Fab
                        className={
                          row.hidden
                            ? "action_btn done hidden"
                            : "action_btn hidden"
                        }
                        title={row.hidden ? "unhide" : "hide"}
                        onClick={() => {
                          setId(row.id);
                          setAction("hide");
                          setIndex(index);
                        }}
                      >
                        {!row.hidden ? <HiddenIcon /> : <DoneAll />}
                      </Fab>
                      <Fab
                        className="action_btn delete"
                        title="delete"
                        onClick={() => {
                          setId(row.id);
                          setAction("delete");
                          setIndex(index);
                        }}
                      >
                        <Delete />
                      </Fab>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
