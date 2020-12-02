import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

const details = JSON.parse(localStorage.getItem("details"));

export default function Me() {
  const { push } = useHistory();
  console.log(details);
  return (
    <div className="display">
      <Card className="card">
        <CardActionArea>
          <Typography variant="subtitle2">wallet</Typography>
          <Typography variant="h4" className="card_content">
            ${details.cash || 0}
          </Typography>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2">
              Account Balance
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <Typography variant="h6">Account ID:</Typography>
              <Typography variant="body1">
                {details.account_num || details._id}
              </Typography>
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            className="btn_"
            size="small"
            color="primary"
            onClick={() => {
              push("/dashboard/deposit");
            }}
          >
            Fund
          </Button>
          <Button
            className="btn_"
            size="small"
            color="primary"
            onClick={() => {
              push("/dashboard/send");
            }}
          >
            Send
          </Button>
        </CardActions>
      </Card>
      <Typography variant="body1">
        No transactions have been made yet
      </Typography>
    </div>
  );
}
