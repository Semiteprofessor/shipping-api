const OtpEnum = {
    REGISTRATION: 0,
    PASSWORD_RESET: 1
}

const TransactionStatusEnum = {
    PENDING: "pending",
    FAILED: "failed",
    ROLLBACK: "rollback",
    SUCCESS: "completed"
}

const TransactionTypeEnum = {
    CREDIT: "credit",
    DEBIT: "debit"

}


module.exports = {
    OtpEnum,
    TransactionTypeEnum,
    TransactionStatusEnum
}