const nodemailer = require('nodemailer')

let hosts = {
    'office365' : {
        host: 'smtp.office365.com', // Office 365 server
        port: 587,     // secure SMTP
        secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
        auth: {
            user: 'aobando@kayser.cl',//default configuration
            pass: 'PilarcitA1626'
        },
        tls: {
            ciphers: 'SSLv3'
        }    
    },
    service: 'gmail',
    auth: {
        user: 'kayser.developers@gmail.com',
        pass: 'ResyaK2357'
    }    
}
module.exports = {
    sendEmail : async function(host, subject, msg, sender, receiver){
        let transporter = nodemailer.createTransport(hosts[host])
        let mailOptions = {
            from : sender,
            to : receiver,
            subject : subject,
            text : msg
        }
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return { success : false, msg : error }
            } else {
                return { success: false, msg : info.response }
            }
        })
    }
}