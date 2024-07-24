const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const sequelize = require("./config/database.config");
require("dotenv").config();
require("./config/passport.config");

const authRoutes = require("./routes/auth.route");
const shippingRoutes = require("./routes/shipping.route");

const app = express();

app.use(bodyParser.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/shipping", shippingRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database connected and synchronized");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
