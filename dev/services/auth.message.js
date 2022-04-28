module.exports = {
    PasswordMissMatched:{
        status:400,
        message: "password Miss match"
    },
    userNotFound:{
        status:404,
        message: "User not found"
    },
    badOTP:{
        status:400,
        message: "OTP Miss match"
    },
    successOTPMatch:{
        status:200,
        message: "successfully match"
    },
    linkExpired:{
        status:401,
        message: "link expired"
    },
    badRequestOldPassword:{
        status:400,
        message: "old password used"
    },
    serverError:{
        status:500,
        message: "somthing went wrong"
    },
    successOTPPassword:{
        status:200,
        message: "successfully password changed"
    },
}