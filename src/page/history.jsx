import { Typography } from "@material-ui/core";
import React from "react";

export default function HistoryPage() {
  return (
    <div className="History">
      <Typography variant="h5" className="title">
        Recent Transactions
      </Typography>
      <Typography variant="body1">
        No transactions have been made yet
      </Typography>
    </div>
  );
}
