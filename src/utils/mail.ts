import nodemailer from 'nodemailer';
const emailUser = process.env.EMAIL_USER;
const userPassword = process.env.USER_PASSWORD;

export const mailService = async (to: any, name: any) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: emailUser,
      pass: userPassword,
    },
  });

  const mailOption = {
    from: 'onlinebookstore2002@gmail.com',
    to: to,
    subject: 'BookStore online webService !',
    text: `${name} your order is created successfully ! Thank you for your order !`,
  };

  transporter.sendMail(mailOption, function (error, info) {
    if (error) {
      console.log('Email sending error...', error);
    } else {
      console.log('Mail has been sent in your register mail ', info.response);
    }
  });
};
