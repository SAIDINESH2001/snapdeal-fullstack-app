const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 5000,
    socketTimeout: 5000
});

transporter.verify((error) => {
    if(error) console.error(`Email transportation configuration error:`, error);
    else console.log('Email server is ready');
});

module.exports = transporter;