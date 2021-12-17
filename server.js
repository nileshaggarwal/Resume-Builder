const express = require("express");
const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const cors = require("cors");

const mongoose = require("mongoose");
const { forgotPassword, resetPassword } = require("./forgotPassword");
const { signup, signin, signout, verifyUser } = require("./auth");

const app = express();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

const pdfTemplate = require("./documents");

const options = {
  height: "42cm",
  width: "29.7cm",
  timeout: "6000",
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST route for PDF generation....
app.post("/create-pdf", (req, res) => {
  pdf.create(pdfTemplate(req.body), options).toFile("Resume.pdf", (err) => {
    if (err) {
      console.log(err);
      res.send(Promise.reject());
    } else res.send(Promise.resolve());
  });
});

app.post(
  "/signup",

  signup
);

app.post(
  "/signin",

  signin
);

app.get("/signout", signout);

app.post("/auth/confirm", verifyUser);

app.put("/reset-password", resetPassword);
app.put("/forgot-password", forgotPassword);

// GET route -> send generated PDF to client...
app.get("/fetch-pdf", (req, res) => {
  const file = `${__dirname}/Resume.pdf`;
  res.download(file);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
