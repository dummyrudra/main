const nodemailer = require('nodemailer');
const config = require('config');


// send mail to user 
module.exports.sendMail=(email,subject,content)=>{
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dummyrudra@gmail.com',
                pass: config.get('emailKey')
            }
        });

        const mailOptions = {
            from: 'dummyrudra@gmail.com',
            to: email,
            subject: subject,
            text: content
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return false;
            } else {
                return true;
            }
        });
    }
    catch (err) {
        return false
    }
}