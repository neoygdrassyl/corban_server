const nodemailer = require("nodemailer");
const db = require("../models");
const BD_Users = db.DBS['Database0'];

const _transporter = (_data) => {
    return {
        "host": _data.host ? _data.host : process.env.TRANSPORTER_HOST,
        "port": _data.port ? _data.port :process.env.TRANSPORTER_PORT,
        "secure": _data.secure ? _data.secure :process.env.TRANSPORTER_SECURE,
        "auth": {
            "user": _data.user ? _data.user :process.env.TRANSPORTER_USER,
            "pass": _data.pass ? _data.pass : process.env.TRANSPORTER_PASSWORD,
        }
    }
};

function sendEmail(_data) {

    let transporter = nodemailer.createTransport(_transporter(_data));

    let mailOptions = {};
    mailOptions.from = _data.from;
    mailOptions.subject = _data.subject;
    mailOptions.to = _data.to;
    mailOptions.cc = _data.cc;
    mailOptions.bcc = _data.bcc;
    mailOptions.text = _data.text;
    mailOptions.html = _data.html;

    mailOptions.dsn = {
        id: 'STATUS NO DELIVERY',
        return: 'headers',
        notify: ['failure', 'delay'],
        recipient: _data.bounce
    }

    BD_Users.mailers.create(_data);

    return transporter.sendMail(mailOptions)
}

module.exports = {
    sendEmail,
};