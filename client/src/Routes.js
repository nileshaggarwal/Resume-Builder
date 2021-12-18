import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Resume from "./components/Resume";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import OtpVerification from "./Pages/OtpVerification";

const Hello = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Resume} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <Route
          path="/otpverification/:email"
          exact
          component={OtpVerification}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Hello;
