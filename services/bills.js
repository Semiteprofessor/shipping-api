require('dotenv').config()
const axios = require('axios')


const getToken = async () => { 
  const authResult =
    await axios.post(`https://auth.reloadly.com/oauth/token`, 
    {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'client_credentials',
        audience: 'https://topups-sandbox.reloadly.com'
    })
  return authResult.data.access_token
}

// accessing utility bearer token
const utilAccessToken = async() => {
  try {
    const getUtilityToken =
      await axios.post(`https://auth.reloadly.com/oauth/token`,
        {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'client_credentials',
          audience: 'https://utilities-sandbox.reloadly.com'
        });
  
    return getUtilityToken.data.access_token;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error occurred while retrieving the utility token"
    });
  }
}

const tokenVariable = async() => {
  try{
    const token = getToken()

    const operatorDetail =
      await axios.get('https://topups-sandbox.reloadly.com/countries/NG',
      {
        headers: {
            Authorization: `Bearer ${token}`
          }
      })
    // Extract the operator list from the response
    //const operators = operatorDetail.data.content;
    return operatorDetail.data.content;
    
}catch (error) {
  return error.message
  };
}

const dataOperatorsDetail = async() => {
  try {
    const token = getToken()
    const operatorResult =
      await axios.get('https://topups-sandbox.reloadly.com/operators/countries/NG?includeData=true', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    // Extract the data operator list from the response
    //const dataOperators = operatorResult.data;
    return operatorResult.data

  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error occurred while retrieving the operators"
    });
  }
}

// to topup for airtime or data
const rechargeFunc = async(operatorID,phoneNumber,newAmount) => {
  try {
    const token = getToken()
    await axios.post(`https://topups.reloadly.com/topups`, {
      operatorId: operatorID,
      recipientPhone: phoneNumber,
      amount: newAmount
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
  } catch (error) {

    res.status(500).json({
      status: false,
      message: "Error occurred while processing the purchase of airtime"
    });
  }
}



const billerDetails = async() => {
  try {
    const utilityToken = utilAccessToken();
    const getBills =
      await axios.get('https://utilities-sandbox.reloadly.com/billers', {
        headers: {
          Authorization: `Bearer ${utilityToken}`
        }
      })
    // Extract the billers list from the response
    return billerDetails.content;
 

  } catch (error) {
  
    return false
  }
}

  // to pay for utilities
  const utilityFunc = async(billerId,amount,accountNum) => {
    try {
      const utilAccessToken  = utilAccessToken()
      await axios.post(`https://utilities-sandbox.reloadly.com/pay`,
        {
            billerId,
            amount,
            subscriberAccountNumber: accountNum,
            useLocalAmount: false,
      }, {
        headers: {
          Authorization: `Bearer ${utilAccessToken}`
        }
      });
    } catch (error) {
   
     return false
    }
  }

    
  module.exports = {
    tokenVariable,
    dataOperatorsDetail,
    rechargeFunc,
    billerDetails,
    utilityFunc
  }

