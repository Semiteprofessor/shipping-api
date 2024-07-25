const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const Transaction = sequelize.define("transaction", {
  transaction_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  transaction_type: {
    type: DataTypes.ENUM,
    values: ["credit", "debit"],
    allowNull: false,
  },
  amount: {
    type: DataTypes.DOUBLE(10, 2),
    allowNull: false,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  transaction_status: {
    type: DataTypes.ENUM,
    values: ["pending", "completed", "failed"],
    allowNull: false,
    defaultValue: "pending",
  },
});
Transaction.removeAttribute(["id"]);
module.exports = Transaction;
