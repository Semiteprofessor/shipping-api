const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const Wallet = sequelize.define("wallet", {
  wallet_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount_before: {
    type: DataTypes.DOUBLE(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  amount_after: {
    type: DataTypes.DOUBLE(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
});
Wallet.removeAttribute(["id"]);
module.exports = Wallet;
