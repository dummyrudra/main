
const nodemailer = require('nodemailer');
const config = require('config')


//send mail by software to the client
module.exports = async (req, res, next) => {
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
            to: req.body.email.email,
            subject: req.body.email.subject,
            html:req.body.email.text
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.status(500).send({message:"something went wrong"})
            } else {
                return res.send({message:"Email sent successfully"})
            }
        });
    }
    catch (err) {
        next(err)
    }
}
