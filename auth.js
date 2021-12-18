require("dotenv").config();

const User = require("./user");

var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const otpGenerator = require("otp-generator");

exports.signup = (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  var token = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  console.log(token);
  token = Number(token);

  req.body.confirmationCode = token;

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    console.log(`${user.name} created`);
    return res.status(200).json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });

  sendConfirmationEmail(user.name, user.email, user.confirmationCode);
};

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

function sendConfirmationEmail(name, email, confirmationCode) {
  console.log("CHECK");
  transport
    .sendMail({
      from: process.env.USER,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <p>Your Verification Code:<b>${confirmationCode}</b></p>
        </div>`,
    })
    .catch((err) => console.log(err));
}

exports.verifyUser = (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;
  console.log(email, otp);
  User.findOne({
    email: email,
    confirmationCode: otp,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Wrong Otp Entered" });
      }
      user.status = "Active";
      user.save((err, user) => {
        if (err) {
          return res.status(500).json({ error: "wrong otp entered" });
        } else {
          return res.status(200).json(user);
        }
      });
    })
    .catch((e) => console.log("error", e));
};

///
exports.signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exist",
      });
    }

    if (!user.authenticate(password)) {
      res.status(400).json({
        error: "Email and password do no match",
      });
    }

    if (user.status != "Active") {
      return res.status(401).json({
        error: "Pending Account,Please verify your email before signing in",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    res.cookie("token", token, { expire: new Date() + 5 });

    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully",
  });
};

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not an registered artist",
    });
  }
  next();
};
