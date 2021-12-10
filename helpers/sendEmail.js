'use strict';

import  dotenv from 'dotenv';
import  nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  
  service: 'gmail',
  auth: {
    user: process.env.nodemailer_account,
    pass: process.env.nodemailer_password
  }
});




var mailOptions = {
  from: process.env.nodemailer_account,
  to: 'devjoytib@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 


