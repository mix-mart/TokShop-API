const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
    constructor(user, resetCode) {
        this.to = user.email;
        // this.firstname = user.user_name.split(' ')[0];
        this.firstname = user.firstName;
        this.resetCode = resetCode;
        this.from = `Mix Mart <info@mix-mart.online>`;
    }





    // newTransport() {
    //     return nodemailer.createTransport({
    //         host: "smtp.office365.com",
    //          secure: false,
    //         port: 587,
    //         domain: 'mix-mart.online',
    //         auth: {
    //             user: "info@mix-mart.online",
    //             pass: "mbrskkpcwtsmfmvh"
    //         },
    //         // secureConnection: true,
    //         // tls: { ciphers: 'SSLv3' }

    //     });
    // }
    newTransport() {
      return nodemailer.createTransport({
          host: "smtpout.secureserver.net", // GoDaddy's SMTP host
          port: 465, // Port for secure SMTP
          secure: true, // Use SSL
          auth: {
              user: "info@mix-mart.online", // Your email address
              pass: "M0XM@rt007@@" // Your email password
          }
      });
  }
  




    async send(res, template, subject) {
        const html = pug.renderFile(
            `${__dirname}/../views/emails/${template}.pug`,
            {
                firstName: this.firstname,
                resetCode: this.resetCode,
                subject
            }
        );

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,

            html,
            text: htmlToText(html)
        };

        return await this.newTransport().sendMail(mailOptions).then((info) => {
            console.log(`Message sent: ${info.response}`);
        });
    }



    async sendPasswordReset(res) {
        return await this.send(res,
            'passwordReset',
            'Your Password Reset Token is only valid for 10 mins'
        );
    }
};