import React, { useEffect, useState } from "react";
import "../styles/dashboard.scss";
import MaterialTable from "material-table";
import moment from "moment";
import Axios from "axios";
import back_url from "../secret";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import _ from "lodash";

function createBlock(
  name,
  account_number,
  account_type,
  cash,
  dob,
  id,
  locked
) {
  return { name, account_number, account_type, cash, dob, id, locked };
}
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const columns = [
  { title: "Name", field: "name" },
  { title: "Account Number", field: "account_number" },
  { title: "Account Type", field: "account_type" },
  {
    title: "Cash",
    field: "cash",
  },
  {
    title: "Date of Birth",
    field: "dob",
  },
  {
    title: "Locked Status",
    field: "locked",
  },
];

function TableMain() {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const [data, setdata] = useState([]);
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
                ? "Yes"
                : "No"
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

  const handleClose = (_event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    seterror(false);
  };

  return (
    <>
      <Snackbar open={error} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Unable to perform action.
        </Alert>
      </Snackbar>
      <MaterialTable
        title="Accounts"
        columns={columns}
        data={data}
        isLoading={loading}
        editable={{
          isEditable: (rowData) => rowData.cash,
          isEditHidden: (rowData) => !rowData.cash,
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              if (newData.cash === oldData.cash) {
                resolve();
                return;
              }
              let type = "withdraw";
              let amount = "";
              let amountNewInNum = parseInt(
                newData.cash.replace("$", "").replace("£", ""),
                10
              );
              let amountOldInNum = parseInt(
                oldData.cash.replace("$", "").replace("£", ""),
                10
              );
              if (amountNewInNum > amountOldInNum) {
                type = "deposit";
                amount = `+${amountNewInNum - amountOldInNum}`;
              } else {
                type = "withdraw";
                amount = `-${amountOldInNum - amountNewInNum}`;
              }
              Axios({
                method: "POST",
                url: `${back_url}/data/update`,
                data: {
                  account_number: oldData.account_number || "",
                  cash: newData.cash.replace("$", "").replace("£", ""),
                  type,
                  amount,
                  hide: newData.locked.toLowerCase() === "yes" ? true : false,
                },
              })
                .then(() => {
                  if (oldData) {
                    setdata((prevState) => {
                      let data = prevState;
                      _.remove(data, {
                        cash: oldData.cash,
                        account_number: oldData.account_number,
                      });
                      return [...data, newData];
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  seterror(true);
                })
                .finally(() => {
                  resolve();
                });
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              Axios({
                method: "DELETE",
                url: `${back_url}/data?account_number=${
                  oldData.account_number || ""
                }`,
              })
                .then(() => {
                  setdata((prevState) => {
                    let newData = _.filter(prevState, (r) => {
                      return r.account_number !== oldData.account_number;
                    });
                    return [...newData];
                  });
                })
                .catch(() => {
                  seterror(true);
                })
                .finally(() => {
                  resolve();
                });
            }),
        }}
      ></MaterialTable>
    </>
  );
}

export default function Dashboard() {
  return (
    <div className="Dashboard">
      <div className="heading">
        <span className="logo" role="img"></span>
      </div>
      <div className="main">
        <TableMain />
      </div>
      <footer>
        &copy; COPYRIGHT {moment().format("YYYY")} ALL Right Reservered
      </footer>
    </div>
  );
}
