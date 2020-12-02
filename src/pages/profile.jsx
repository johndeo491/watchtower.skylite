import { Avatar, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import "../styles/profile.scss";
import moment from "moment";
import { Check, CheckRounded } from "@material-ui/icons";

export default function Profile() {
  const details = useSelector((state) => state.event.details);
  return (
    <div className="Profile">
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
        <span className="txt">{details.email || ""}</span>
        <span className="txt">{details.phone_number || ""}</span>
        <span className="txt">
          verified{" "}
          <span>
            <CheckRounded />
          </span>
        </span>
      </div>
      <Typography variant="h5" className="det_head">
        More Details
      </Typography>
      <div className="det">
        <Typography variant="h6">Date of Verification: </Typography>
        <Typography variant="body2">
          {moment(details.date_of_creation).format("MMMM, Do yyyy")}
        </Typography>
      </div>
      <div className="det">
        <Typography variant="h6">marital status: </Typography>
        <Typography variant="body2">{details.marital_status}</Typography>
      </div>
      <div className="det">
        <Typography variant="h6">sex: </Typography>
        <Typography variant="body2">{details.sex}</Typography>
      </div>
      <div className="det">
        <Typography variant="h6">postal code: </Typography>
        <Typography variant="body2">{details.postal_code}</Typography>
      </div>
      <div className="det">
        <Typography variant="h6">address:</Typography>
        <Typography variant="body2">{details.address}</Typography>
      </div>
      <div className="det">
        <Typography variant="h6">city:</Typography>
        <Typography variant="body2">{details.city}</Typography>
      </div>
      <div className="det">
        <Typography variant="h6">country:</Typography>
        <Typography variant="body2">{details.country}</Typography>
      </div>
      <div className="det">
        <Typography variant="h6">account currency:</Typography>
        <Typography variant="body2">{details.account_currentcy}</Typography>
      </div>
    </div>
  );
}
