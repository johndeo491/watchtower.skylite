import React from "react";
import {
  Redirect,
  Route,
  Switch as MainRoute
} from "react-router-dom";
import DashBoard from "./views/dashboard2";
import Login from "./views/login";

const admin = localStorage.getItem("admin");
export default function App() {
  if (!admin) {
    return (
      <MainRoute>
        <Route path="/login" component={Login} />
        <Redirect from="*" to="/login" />
      </MainRoute>
    ) ;
  }
  return ( 
    <>
      <MainRoute>
        <Route path="/dashboard" component={DashBoard} />
        <Redirect from="/login" to="/dashboard" exact />
        <Redirect from="/" to="/dashboard" exact />
      </MainRoute>
    </>
  );
}