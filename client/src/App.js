import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import Routes from "./Routes";
import { isAutheticated, signout } from "./Pages/helper/authhelper";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: "white",
  },
}));

export function App() {
  const refreshPage = () => {
    window.location.reload();
  };

  const classes = useStyles();
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <a className="title" href="/">
              Resume Builder
            </a>
          </Typography>
          {!isAutheticated() && (
            <Button color="inherit" href="/signin">
              Login
            </Button>
          )}
          {isAutheticated() && (
            <div>
              <span
                onClick={() => {
                  signout(() => {
                    refreshPage();
                  });
                }}
                style={{ cursor: "pointer" }}
              >
                Signout
              </span>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Routes />
    </div>
  );
}

export default App;
