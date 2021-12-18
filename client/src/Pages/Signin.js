import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/signin.css";
import { signin, authenticate, isAutheticated } from "./helper/authhelper";
import { Redirect } from "react-router-dom";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    didRedirect: false,
  });

  const { email, password, error, loading, didRedirect } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
          errorMessage();
        } else {
          authenticate(data, () => {
            setValues({
              ...values,
              didRedirect: true,
            });
          });
        }
      })
      .catch((err) => console.log("Sigin request failed"));
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading...</h2>
        </div>
      )
    );
  };

  const errorMessage = () => {
    toast(error);
  };

  const performRedirect = () => {
    if (didRedirect) {
      return <Redirect to="/" />;
    }
    if (isAutheticated()) {
      return <Redirect to="/" />;
    }
  };

  const SigninPage = () => {
    return (
      <div className="signin">
        <div className="signincard">
          <h1>Login to Explore</h1>
          <div className="signinform">
            <div className="signinemail">
              <input
                type="email"
                placeholder="abc@gmail.com"
                required
                value={email}
                onChange={handleChange("email")}
              />
            </div>
            <div className="signinpassword">
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={handleChange("password")}
              />
            </div>
            <div className="signinbutton">
              <button onClick={onSubmit}>Login</button>
            </div>
            <div className="forgotpassword">
              <a href="/hello">Forgot Password?</a>
            </div>
            <div className="createaccount">
              <a href="/signup">Signup|Create new account</a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="signinpage">{SigninPage()}</div>
      {loadingMessage()}
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

export default Signin;
