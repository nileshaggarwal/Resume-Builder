const User = require("./user");
const nodemailer = require("nodemailer");
var jwt = require("jsonwebtoken");

exports.forgotPassword = (req, res) => {
  const resetEmail = req.body.resetEmail;

  const email = resetEmail;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: `User with this email does not exists!` });
    }

    const token = jwt.sign({ _id: user._id }, process.env.RESET_KEY, {
      expiresIn: "20m",
    });

    const data = {
      from: process.env.USER,
      to: user.email,
      subject: "Reset Password Token",
      text:
        `Hey ${user.name},\n\n` +
        "This mail is from Artistry Goa regarding Password Reset" +
        "If you didn't try to reset password, please ignore this email" +
        "However if you did,here's your password reset link:\n" +
        `http://localhost:3000/forgot-password/${token}`,
    };

    return user.updateOne({ resetLink: token }, function (err, success) {
      if (err) {
        return res.status(400).json({ error: "Reset password link error" });
      } else {
        transport.sendMail(data, function (err, msg) {
          if (err) {
            console.log("send mail error-", err.message);
            res.json({ error: "Couldn't send mail to your address" });
          } else {
            console.log(
              `Sent password reset link to ${user.email} successfully.`
            );
            res.json(true);
          }
        });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetLink, newPass } = req.body;

  if (resetLink) {
    jwt.verify(resetLink, process.env.RESET_KEY, function (error, decodedData) {
      if (error) {
        return res.status(401).json({
          error: "Incorrect token or its is expired",
        });
      }
      User.findOne({ resetLink }, (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ error: "User with this token doesnt exist" });
        }
        const obj = {
          password: newPass,
          resetLink: "",
        };
        user.password = obj.password;
        user.resetLink = obj.resetLink;
        user.save((err, result) => {
          if (err) {
            return res.status(400), { error: "Reset password error" };
          } else {
            console.log(`${result}`);
            return res
              .status(200)
              .json({ message: "Your password has been changed" });
          }
        });
      });
    });
  } else {
    return res.status(401).json({ error: "Authentication error" });
  }
};

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});
