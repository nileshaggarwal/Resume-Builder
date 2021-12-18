import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/signup.css";

import { signup } from "./helper/authhelper";
import { Redirect } from "react-router-dom";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { name, email, password, error, success } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ name, email, password }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
        errorMessage();
      } else {
        setValues({
          ...values,
          name: "",
          password: "",
          error: "",
          success: true,
        });
      }
    });
  };

  const errorMessage = () => {
    toast(error);
  };

  const performRedirect = () => {
    if (success === false) {
      return <Redirect to="/signup" />;
    } else {
      var url = `/otpverification/${email}`;
      console.log(url);
      return <Redirect to={url} />;
    }
  };

  const SignupPage = () => {
    return (
      <div className="signup">
        <div className="signupcard">
          <h1>Create new account</h1>
          <div className="signupform">
            <div className="signupname">
              <input
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={handleChange("name")}
              />
            </div>
            <div className="signupemail">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={handleChange("email")}
              />
            </div>
            <div className="signuppassword">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={handleChange("password")}
              />
            </div>
            <div className="signupbutton">
              <button onClick={onSubmit}>Signup</button>
            </div>
            <div className="existingaccount">
              <a href="/signin">Signin|Login to existing account</a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {SignupPage()}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {performRedirect()}
    </div>
  );
};

export default Signup;
