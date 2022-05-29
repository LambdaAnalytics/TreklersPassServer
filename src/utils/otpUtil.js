const axios = require('axios').default;
// const otpAPIURI = `https://api.wegusinfotech.in/api/v2/SendSMS`;
const otpAPIURI = `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS`;

const config = {
  SenderId: process.env.OTP_SENDER_ID,
  Is_Unicode: 'false',
  Is_Flash: 'false',
  ApiKey: process.env.OTP_API_KEY,
  ClientId: process.env.OTP_CLIENT_ID,
};

exports.OTPUtil = (function () {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function OTPUtil() {}
  // OTPService.sendOtpToSms = function (smsOtp, mobileNumber) {
  //     return axios.get(otpAPIURI, {
  //         params: {
  //             ...config,
  //             "msg": smsOtp || `${process.env.OTP_TEMPLATE}`.replace(/{otp}/g, smsOtp),
  //             "contacts": `${mobileNumber}`,
  //         }
  //     }).then((d) => {
  //         try {
  //             console.log(`OTP - ${smsOtp} mobile - ${mobileNumber} ${d.data.ErrorDescription}`)
  //         } catch (e) {
  //             console.log(smsOtp, mobileNumber, "otp --> something went wrong", e);
  //         }
  //     }).catch(e => {
  //         console.log(`OTP - ${smsOtp} mobile - ${mobileNumber}`, e)
  //     });
  // };
  OTPUtil.sendOtpToSms = function (smsOtp, mobileNumber) {
    return axios
      .get(`${otpAPIURI}/${mobileNumber}/${smsOtp}/${process.env.OTP_CLIENT_ID}`)
      .then((d) => {
        try {
          // console.log(`OTP - ${smsOtp} mobile - ${mobileNumber} ${d.data.ErrorDescription}`);
        } catch (e) {
          // console.log(smsOtp, mobileNumber, 'otp --> something went wrong', e);
        }
      })
      .catch((e) => {
        // console.log(`OTP - ${smsOtp} mobile - ${mobileNumber}`, e);
      });
  };
  return OTPUtil;
})();
