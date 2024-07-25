require("dotenv").config();
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const validateRegisterUser = require("../validations/user.validation");
const { hashPassword } = require("../utils/helper.util");
const { v4: uuidv4 } = require("uuid");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error !== undefined) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      city,
      state,
      zip_code,
      country,
    } = req.body;
    const checkIfUserExist = await User.findAll({
      attributes: ["email", "phone"],
      where: {
        [Op.or]: [{ email: email }, { phone: phone }],
      },
    });

    if (checkIfUserExist.length > 0) {
      res.status(400).json({
        status: false,
        message: userExists,
      });
      return;
    }

    const { hash, salt } = await hashPassword(password);
    const userID = uuidv4();
    const user = await User.create({
      name,
      email,
      password_hash: hash,
      password_salt: salt,
      phone,
      address,
      city,
      state,
      zip_code,
      country,
      user_id: userID,
    });
    await Wallet.create({
      wallet_id: uuidv4(),
      user_id: userID,
    });

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Welcome to Our Service",
      templateId: "d-1234567890abcdef1234567890abcdef", // Replace with your SendGrid template ID
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

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.update({ name, email, role, isActive });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
