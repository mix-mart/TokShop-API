const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        // this.firstname = user.user_name.split(' ')[0];
        this.firstname = user.firstName;
        this.url = url;
        this.from = `Mix Mart <mixmart007@mix-mart.online>`;
    }



    // var transport = nodemailer.createTransport({
    //     host: "live.smtp.mailtrap.io",
    //     port: 587,
    //     auth: {
    //         user: "api",
    //         pass: "859af3bc018dc4a4335e0dbdeda73556"
    //     }
    // });


    // newTransport() {
    //     return nodemailer.createTransport({
    //         host: "sandbox.smtp.mailtrap.io",
    //         secure: false,
    //         port: 587,
    //         auth: {
    //             user: "2bc2de9bca5c41",
    //             pass: "0cdfd27d20ce3b"
    //         },
    //         tls: {
    //             rejectUnauthorized: false
    //         }
    //     });
    // }

    newTransport() {
        return nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            secure: false,
            port: 587,
            domain: 'mix-mart.online',
            auth: {
                user: "api",
                pass: "859af3bc018dc4a4335e0dbdeda73556"
            },
            // tls: {
            //     rejectUnauthorized: false
            // }
        });
    }

    async send(res, template, subject) {
        const html = pug.renderFile(
            `${__dirname}/../views/emails/${template}.pug`,
            {
                firstName: this.firstname,
                url: this.url,
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