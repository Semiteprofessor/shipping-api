const sgMail = require("@sendgrid/mail");
const Shipping = require("../models/shipping.model");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.createShipping = async (req, res) => {
  try {
    const { address, city, state, zip, country } = req.body;
    const shipping = await Shipping.create({
      userId: req.user.id,
      address,
      city,
      state,
      zip,
      country,
    });

    const msg = {
      to: req.user.email,
      from: process.env.EMAIL_FROM,
      subject: "Shipping Order Created",
      templateId: "d-0987654321abcdef0987654321abcdef", // Your SendGrid template ID
      dynamic_template_data: {
        name: req.user.name,
        address,
        city,
        state,
        zip,
        country,
      },
    };

    await sgMail.send(msg);

    res.status(201).json(shipping);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getShippings = async (req, res) => {
  try {
    const shippings = await Shipping.findAll({
      where: { userId: req.user.id },
    });
    res.status(200).json(shippings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
