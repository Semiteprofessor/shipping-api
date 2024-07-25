require('dotenv').config()
const { default: axios } = require('axios')


const accountResolver = (account_number,bank_code) => {
    return axios({
        method: 'get',
        url: `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
            }
            
    })
}

module.exports = accountResolver