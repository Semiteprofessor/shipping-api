require("dotenv").config();
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const validateRegisterUser = require("../validations/user.validation");
const { hashPassword } = require("../utils/helper.util");
const { sendEmail } = require("../services/email");
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

    //give them 1000 on signup
    credit(200, userID, `Wallet funding for signup credits`);

    //send as sms
    //send as email
    sendEmail(
      email,
      "OTP",
      `Hi ${surname}, Welcome, your to Geocodec Shipping Services`
    );

    res.status(201).json({
      status: true,
      message: registerMessage,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.verifyUserAccount = async (req, res) => {
  const { otp, email } = req.params;
  if (!otp || !email) {
    res.status(400).json({
      status: false,
      message: "Bad request",
    });
    return;
  }
  try {
    const otpData = await OtpModel.findOne({
      where: {
        email_or_phone: email,
        otp: otp,
        otp_type: OtpEnum.REGISTRATION,
      },
    });
    if (!otpData) {
      res.status(400).json({
        status: false,
        message: invalidOtp,
      });
      return;
    }
    //check if otp has expired

    await User.update(
      {
        isOtpVerified: true,
      },
      {
        where: {
          email: email,
        },
      }
    );

    await OtpModel.destroy({
      where: {
        email_or_phone: email,
        otp_type: OtpEnum.REGISTRATION,
      },
    });

    res.status(200).json({
      status: true,
      message: "Account verified successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.getUserDetails = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    res.status(400).json({
      status: false,
      message: "Bad request",
    });
    return;
  }
  try {
    const user = await User.findOne({
      attributes: [
        "name",
        "email",
        "phone",
        "address",
        "city",
        "zip_code",
        "country",
      ],
      where: {
        user_id: user_id,
      },
    });
    if (!user) {
      res.status(400).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    res.status(200).json({
      status: true,
      data: user,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({
      status: false,
      message: "bad request",
    });
  }
  ///use joi to validate the request body
  const { error } = validateRegisterUser(req.body);
  if (error !== undefined) {
    res.status(400).json({
      status: false,
      message: error.details[0].message || "Bad request",
    });
    return;
  }
  try {
    await User.update(req.body, {
      where: {
        user_id: user_id,
      },
    });

    res.status(200).json({
      status: true,
      message: "user profile updated successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.userLogin = async (req, res) => {
  //login user
  const { email, password } = req.body;
  try {
    if (!email || !password) throw new Error("All fields are required");
    const checkIfUserExists = await User.findOne({
      where: { email: email },
    });
    if (checkIfUserExists == null) throw new Error("Invalid email or password");
    let payload;
    let accessToken;

    const dataToaddInMyPayload = {
      email: checkIfUserExists.email,
      _id: uuidv4(),
    };

    const compareHash = await bcrypt.compare(
      password,
      checkIfUserExists.password_hash
    );
    if (!compareHash) throw new Error("Invalid email or password");
    if (!checkIfUserExists.isOtpVerified) {
      res.status(400).json({
        status: false,
        level: 2,
        message: "Account not verified",
      });
      return;
    }
    const token = await jwt.sign(dataToaddInMyPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      status: true,
      message: loginMessage,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

