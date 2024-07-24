const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const User = require("../models/user.model");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Welcome to Shipping API",
      templateId: "d-1234567890abcdef1234567890abcdef", // Your SendGrid template ID
      dynamic_template_data: {
        name: user.name,
      },
    };

    await sgMail.send(msg);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.login(user, { session: false }, (err) => {
      if (err) return next(err);
      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ user, token });
    });
  })(req, res, next);
};
