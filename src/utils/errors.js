var newError = function(error, detail) {
	var val= {
		error_code: error.code,
		message: error.message,
		detail : detail
	};
	return val;
}

var errorsEnum = {
    InternalError : {code : 1000, message : "Internal api error"},
    LoginCredentialsError : {code: 1001, message : "Please enter correct username/password"},
    GetAllGpsDevicesError : {code: 1002, message: "Internal error on fetching device details"},
    UserRetrieveError : {code: 1003, message : "Internal error on fetching user"},
    UserUpdateError : {code: 1004, message : "Internal errro on updating user"},
    SuccessMessage : {code:1005, message: "Success"},
    ForgotPasswordMobileNumber : {code: 1006, message: "Please enter registerd mobile number"},
    ForgotPasswordReset : {code: 1007, message: "Successfull updated the password, Please login with new password"},
    ForgotPasswordVerifyOtp : {code: 1008, message: "Please enter correct Otp."},
    UserAlreadyExists : {code : 1009, message : "Mobile Number/Email is already exists"},
    EngineAuthCheckError : {code : 1010, message: "Please enter correct password"},
    UnCompleteRegistration : {code : 1011, message: "Please complete your registration"},

    UserCreationError : {code : 1000, message : "User creating error"},
    UserDeleteError : {code: 1003, message : "User delete error"},
    UserOtpVerificationError : {code : 1004, message : "User Otp verification error"},
    UserMobileNumberverifiedError : {code : 1005, message : "User Mobile Number Verification Error"},
    UserMobileNumberverifiedError : {code : 1006, message : "Please verify your mobile number"},
    GpsMappingError : {code : 1007, message : "Gps details mapping error"},
    GpsRetrieveError : {code: 1008, message : "Gps details retrieving error"},
    GpsUpdateError : {code: 1009, message : "Gps details update error"},
    GpsDeleteError : {code: 1010, message : "Gps details delete error"},
    HistorySavingError : {code : 2000, message : "History saving error"},
    HistoryRetrieveError : {code: 2001, message : "History retrieving error"},
    HistoryUpdateError : {code: 2002, message : "History update error"},
    HistoryDeleteError : {code: 2003, message : "History delete error"},

}

exports.errorsEnum = errorsEnum;
exports.newError = newError;


