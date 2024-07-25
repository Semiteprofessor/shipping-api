require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const data = new FormData();

const sendSMS = async(to, message) => {
    data.append('token', process.env.SMS_TOKEN);
    data.append('sender', process.env.SMS_SENDER_ID);
    data.append('to', to);
    data.append('message', message);
    data.append('type', 0); //From their docs: 0 = Plain Text 1 = Flash Plain Text 2 = Unicode SMS 6 = Unicode Flash SMS
    data.append('routing', 3); //from their docs: 3 = Deliver message to both DND and non-DND numbers using the normal route
    try {
        await axios({
            method: 'post',
            url: `${process.env.SMS_BASE_URL}/sms/`,
            data: data,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'Accept': 'application/json'

            }

        })
    } catch (error) {
        console.log(error)
    }
  
}



module.exports = {
    sendSMS
}