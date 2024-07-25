require('dotenv').config()
const { default: axios } = require('axios')


const bankList = () => {
    return axios({
        method: 'get',
        url: 'https://api.paystack.co/bank',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    })
}


module.exports = bankList