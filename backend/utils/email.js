const nodemailer = require('nodemailer');

const sentEmail = async options => {
    const transport = {
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        auth : {
            user : process.env.SMTP_USER,
            pass : process.env.SMTP_PASS
        }
    }

    const transporter =  nodemailer.createTransport(transport);
    
    const messsage ={
        from : `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to : options.email,
        subject : options.subject,
        text : options.message
    }
    await transporter.sendMail(messsage);
}

module.exports = sentEmail;