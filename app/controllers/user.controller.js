const db = require("../models");
const jwt = require("jsonwebtoken");
const BD_Users = db.DBS['Database0'];
var queries = require('../resources/sqlQueries')
const { QueryTypes } = require('sequelize');
const { sendEmail } = require("../resources/mailer");
const { resetPaswordText, resetPaswordHTML, verifyAccountHTML, verifyAccountText, activateAccountHTML, activateAccountText, inviteWorkTeamHTML, inviteWorkTeamText, userJoinedTeamHTML, userJoinedTeam2Text, userJoinedTeam2HTML, userJoinedTeamText } = require("../resources/mailer.templates/email.templates");
const { verifyPermit } = require("../resources/permits.controller");
const { addNotification } = require("../resources/notificacions.controller");

exports.appLogin = (req, res) => {
    const _email = req.body.email;
    const _pass = req.body.password;

    BD_Users.logins.findAll({ where: { loginUser: _email } })
        .then(data => {
            if (data.length == 0) res.send('ERROR_1'); //USER DOES NOT EXISTS

            if (data[0].verified == 0) res.send('ERROR_3'); // USER HAS NOT VERIFIED ACCOUNT

            var SHA256 = require("crypto-js/sha256");
            let finalHash = SHA256(_pass + data[0].passwordSalt).toString();

            if (finalHash == data[0].passwordHash) {

                BD_Users.query(queries.loadUserData(_email), { type: QueryTypes.SELECT })
                    .then(data => {
                        let user = data[0];

                        jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 20 }, (err, token) => {
                            if (err) res.status(500).send({ message: err.message || "Some error occurred." });
                            user.token = token;
                            res.send(user);
                        });

                    })
                    .catch(err => {
                        res.status(500).send({ message: err.message || "Some error occurred." });
                    });
            }
            else res.send('ERROR_2'); //NO USER LOGIN
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving DATA for LOGIN: " + err });
        });
};

exports.appSignUp = (req, res) => {
    const _email = req.body.email;
    const _idnumber = req.body.id_number;
    const _password = req.body.password;
    const _lang = req.body.lang ? req.body.lang : 'en';

    BD_Users.query(queries.ValidateSignUp(_email, _idnumber), { type: QueryTypes.SELECT })
        .then(data => {
            if (data.length > 0) return res.send('ERROR_SIGNUP'); // USER LOGIN OR ID ALREADY EXISTS 

            let object = {
                name: req.body.name,
                name_2: req.body.name_2,
                surname: req.body.surname,
                surname_2: req.body.surname_2,
                email: _email,
                phone: req.body.phone,
                type: req.body.type,
                name_agent: req.body.name_agent,
                id_number: _idnumber,
            }

            BD_Users.users.create(object)
                .then(userData => {
                    let SHA256 = require("crypto-js/sha256");

                    let passwordSalt = makeid(16);
                    let passwordHash = SHA256(_password + passwordSalt).toString()

                    let userId = userData.id;

                    let object = {
                        loginUser: _email,
                        passwordSalt: passwordSalt,
                        passwordHash: passwordHash,
                        userId: userId,
                    }

                    BD_Users.logins.create(object)
                        .then(lData => {
                            appVerifyAccountEmail(lData, userData, _lang, req, res)
                        })
                        .catch(err => {
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while executing CREATE."
                            });
                        });
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while executing CREATE."
                    });
                });

        })
        .catch(err => {
            res.status(500).send({ message: "ERROR AT SIGN UP " + err });
        });
};

exports.appVerifyAccountEmailReminder = (req, res) => {
    const _lang = req.body.lang ? req.body.lang : 'en';
    const _email = req.body.email;

    BD_Users.query(queries.loadLoginData(_email), { type: QueryTypes.SELECT })
        .then(data => {
            if (data.length == 0) res.send('ERROR_1'); //USER DOES NOT EXISTS

            if (data[0].verified == 1) res.send('ERROR_4'); // USER IS VERIFIED

            let user = data[0];
            appVerifyAccountEmail(user, user, _lang, req, res)
        })

}

function appVerifyAccountEmail(login, user, lang, req, res) {
    let SHA256 = require("crypto-js/sha256");
    let finalHash = SHA256(login.passwordHash + login.passwordSalt).toString();

    jwt.sign({ user: login.loginUser, pass: finalHash }, process.env.JWT_SECRET_KEY, {}, (err, token) => {
        if (err) res.status(500).send({ message: err.message || "Some error occurred." });

        let link = `${__frontDir}/activate/${login.loginUser}&${token}`;

        let emailTitle;
        if (lang == 'en') emailTitle = 'ACTIVATE YOUR ACCOUNT';
        else if (lang == 'es') emailTitle = 'ACTIVACIÓN DE CUENTA';
        else emailTitle = 'ACTIVATE YOUR ACCOUNT';

        let emailData = {
            from: `CORBAN SOFTWARE <${process.env.TRANSPORTER_USER}>`,
            subject: emailTitle,
            to: login.loginUser,
            cc: false,
            bcc: false,
            bounce: process.env.TRANSPORTER_BOUNCE,
            text: verifyAccountText(lang, link, user.name, user.surname),
            html: verifyAccountHTML(lang, link, user.name, user.surname),
        };

        sendEmail(emailData)
            .then(data => {
                res.status(200).send('OK');
            })
            .catch(err => {
                res.status(200).send('ERROR');
            });
    });
};

exports.appVerifyAccount = (req, res) => {
    const _lang = req.body.lang ? req.body.lang : 'en';
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        var token = bearerToken;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, data) => {
            if (error) {
                res.status(200).send("EXPIRED");
            } else {

                BD_Users.query(queries.loadLoginData(data.user), { type: QueryTypes.SELECT })
                    .then(dataLogin => {
                        let user = dataLogin[0];

                        if (user.verified == 1) return res.status(200).send("VERIFIED");

                        let object = { verified: 1 }
                        BD_Users.logins.update(object, { where: { loginUser: user.loginUser } })
                            .then(dataUpdated => {

                                let link = __frontDir + "/login";

                                let emailTitle;
                                if (_lang == 'en') emailTitle = 'ACCOUNT ACTIVATED';
                                else if (_lang == 'es') emailTitle = 'CUENTA ACTIVADA';
                                else emailTitle = 'ACCOUNT ACTIVATED';

                                let emailData = {
                                    from: `CORBAN SOFTWARE <${process.env.TRANSPORTER_USER}>`,
                                    subject: emailTitle,
                                    to: user.loginUser,
                                    cc: false,
                                    bcc: false,
                                    bounce: process.env.TRANSPORTER_BOUNCE,
                                    text: activateAccountText(_lang, link, user.name, user.surname),
                                    html: activateAccountHTML(_lang, link, user.name, user.surname),
                                };

                                sendEmail(emailData)
                                    .then(data => {
                                        res.status(200).send('OK');
                                    })
                                    .catch(err => {
                                        res.status(200).send('ERROR');
                                    });

                            })
                            .catch(err => {
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while executing CREATE."
                                });
                            });

                    })
                    .catch(err => {
                        res.status(500).send({ message: err.message || "Some error occurred." });
                    });



            }
        });
    } else {
        res.status(403).send({ message: "NO JWT" });
    }
};

exports.appResetPassEmail = (req, res) => {
    const _email = req.body.email;
    const _lang = req.body.lang ? req.body.lang : 'en';

    BD_Users.query(queries.loadLoginData(_email), { type: QueryTypes.SELECT })
        .then(data => {

            if (data.length == 0) res.status(200).send('NO USER LOGIN');

            let SHA256 = require("crypto-js/sha256");
            let finalHash = SHA256(data[0].passwordHash + data[0].passwordSalt).toString();

            jwt.sign({ email: _email, pass: finalHash }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' }, (err, token) => {
                if (err) res.status(500).send({ message: err.message || "Some error occurred." });

                let link = `${__frontDir}/reset/${_email}&${token}`;

                let emailTitle;
                if (_lang == 'en') emailTitle = 'PASSWORD RESET REQUEST';
                else if (_lang == 'es') emailTitle = 'SOLICITUD DE RECUPERACIÓN DE CONTRASEÑA';
                else emailTitle = 'PASSWORD RESET REQUEST';

                let emailData = {
                    from: `CORBAN SOFTWARE <${process.env.TRANSPORTER_USER}>`,
                    subject: emailTitle,
                    to: _email,
                    cc: false,
                    bcc: false,
                    bounce: process.env.TRANSPORTER_BOUNCE,
                    text: resetPaswordText(_lang, link, data[0].name, data[0].surname),
                    html: resetPaswordHTML(_lang, link, data[0].name, data[0].surname),
                };

                sendEmail(emailData)
                    .then(data => {
                        res.status(200).send('OK');
                    })
                    .catch(err => {
                        res.status(200).send('ERROR');
                    });
            });

        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred." });
        });
};

// THE TEAM SENDS AN INVITATION TO A USER
// THIS GNERATES A JWT AND SENDS AN EMAIL TO THE USER IN WHICH TO CLICK
// THE JTW CONTAINS {emial: user login name, team: id_public of the company}
exports.setInvitationCursEmail = (req, res) => {
    const _email = req.body.email;
    const _team = req.body.team;
    const _lang = req.body.lang ? req.body.lang : 'en';

    verifyPermit(req, 'worker', 1)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            BD_Users.query(queries.loadLoginData(_email), { type: QueryTypes.SELECT })
                .then(data => {
                    if (data.length == 0) return res.status(200).send('NO USER');
                    let user = data[0];
                    if (user.verified != 1) return res.status(200).send("NOT VERIFIED");
                    if (user.active != 1) return res.status(200).send("NOT ACTIVE");

                    BD_Users.query(queries.loadCompanieData(_team), { type: QueryTypes.SELECT })
                        .then(teamData => {
                            let team = teamData[0];
                            if (teamData.length == 0) return res.status(200).send("NOT TEAM");
                            if (team.active != 1) return res.status(200).send("NOT ACTIVE TEAM");

                            BD_Users.workers.findAll({ where: { userId: user.id, companyId: team.id, } })
                                .then(consultData => {

                                    if (consultData.length > 0) return res.status(200).send("ON TEAM");

                                    jwt.sign({ email: _email, team: _team }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' }, (err, token) => {
                                        if (err) return res.status(500).send({ message: err.message || "Some error occurred." });

                                        let link = `${__frontDir}/invite/${token}`;

                                        let emailTitle;
                                        if (_lang == 'en') emailTitle = 'WORK TEAM INVITATION';
                                        else if (_lang == 'es') emailTitle = 'INVITACIÓN A EQUIPO DE TRABAJO';
                                        else emailTitle = 'WORK TEAM INVITATION';

                                        let team_name = team.name
                                        let emailData = {
                                            from: `CORBAN SOFTWARE <${process.env.TRANSPORTER_USER}>`,
                                            subject: emailTitle,
                                            to: _email,
                                            cc: false,
                                            bcc: false,
                                            bounce: process.env.TRANSPORTER_BOUNCE,
                                            text: inviteWorkTeamText(_lang, link, data[0].name, data[0].surname, team_name),
                                            html: inviteWorkTeamHTML(_lang, link, data[0].name, data[0].surname, team_name),
                                        };
                                        let not_body = ''
                                        if (_lang == 'en') not_body = `The team ${team_name} has sent you an invitation to be part of the team, click here to accept.`
                                        else if (_lang == 'es') not_body = `El equipo ${team_name} te ha enviado una invitación para ser parte del equipo, haz clic en este mensaje aceptar.`;
                                        else not_body = `The team ${team_name} has sent you an invitation to be part of the team, click here to accept.`

                                        addNotification(_email, emailTitle, { body: not_body, link: link })

                                        sendEmail(emailData)
                                            .then(data => {
                                                res.status(200).send('OK');
                                            })
                                            .catch(err => {
                                                res.status(200).send('ERROR');
                                            });
                                    })

                                }).catch(err => { res.status(500).send({ message: err.message || "Some error occurred." }); });

                        }).catch(err => { res.status(500).send({ message: err.message || "Some error occurred." }); });
                }).catch(err => { res.status(500).send({ message: err.message || "Some error occurred." }); });
        }).catch(err => res.status(200).send('NO PERMIT'));
};

/*
THE USER HAS RECIEVED THE EMAIL
ONCE THEY CLICKED ON THE LINK THE SYSTEM CREATES THE WORKER ENRTY
WORKER = userId, companyId, active = 1
ONCE DONE IT SEND AN EMAIL TO THE USER AND TEAM EMAIL CONFIRMING THE JOINING OF THE TEAM

// OUTCOME
------ 200 OK | the desired action was made succesffully

// ERROR OUTCOME
------ 200 EXPIRED | jwt expired
------ 200 NOT VERIFIED | user is not verified
------ 200 NOT ACTIVE | user is not active
------ 200 NOT ACTIVE TEAM | the team is not active
------ 200 NO JWT | no jwt was send 
------ 200 NO USER | the email in the jwt does not matched any login user
------ 200 ON TEAM | the user is already on the team
------ 200 ERROR | error while sending the email
------ 500 {message} | something else happened
*/
exports.accetpInvitationCurs = (req, res) => {
    const _lang = req.body.lang ? req.body.lang : 'en';
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        var token = bearerToken;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, data) => {
            if (error) {
                res.status(200).send("EXPIRED");
            } else {
                let companyIdPublic = data.team
                let userLoginName = data.email

                BD_Users.query(queries.loadUserData(userLoginName), { type: QueryTypes.SELECT })
                    .then(dataLogin => {
                        if (dataLogin.length == 0) return res.status(200).send("NO USER");

                        let user = dataLogin[0];

                        if (user.verified != 1) return res.status(200).send("NOT VERIFIED");
                        if (user.active != 1) return res.status(200).send("NOT ACTIVE");

                        BD_Users.query(queries.loadCompanieData(companyIdPublic), { type: QueryTypes.SELECT })
                            .then(teamData => {
                                let team = teamData[0];
                                if (teamData.length == 0) return res.status(200).send("NOT TEAM");

                                if (team.active != 1) return res.status(200).send("NOT ACTIVE TEAM");
                                let object = {
                                    userId: user.id,
                                    companyId: team.id,
                                    active: 1
                                }

                                BD_Users.workers.findAll({ where: { userId: user.id, companyId: team.id, } })
                                    .then(consultData => {

                                        if (consultData.length > 0) return res.status(200).send("ON TEAM");

                                        BD_Users.workers.create(object)
                                            .then(createdData => {

                                                if (_lang == 'en') emailTitle = 'JOINED TO TEAM';
                                                else if (_lang == 'es') emailTitle = 'INTEGRACIÓN AL EQUIPO';
                                                else emailTitle = 'JOINED TO TEAM';

                                                let teamInfo = GET_JSON_FULL(team.companyInfo)

                                                let emailDataUser = {
                                                    from: `CORBAN SOFTWARE <${process.env.TRANSPORTER_USER}>`,
                                                    subject: emailTitle,
                                                    to: user.loginUser,
                                                    cc: false,
                                                    bcc: false,
                                                    bounce: process.env.TRANSPORTER_BOUNCE,
                                                    text: userJoinedTeamText(_lang, user.name, user.surname, team.name),
                                                    html: userJoinedTeamHTML(_lang, user.name, user.surname, team.name),
                                                };

                                                let emailDataTeam = {
                                                    from: `CORBAN SOFTWARE <${process.env.TRANSPORTER_USER}>`,
                                                    subject: emailTitle,
                                                    to: teamInfo.email1,
                                                    cc: false,
                                                    bcc: false,
                                                    bounce: process.env.TRANSPORTER_BOUNCE,
                                                    text: userJoinedTeam2Text(_lang, user.name, user.surname, team.name),
                                                    html: userJoinedTeam2HTML(_lang, user.name, user.surname, team.name),
                                                };

                                                sendEmail(emailDataUser).then(data => {
                                                    sendEmail(emailDataTeam).then(data => {
                                                        res.status(200).send('OK');
                                                    }).catch(err => res.status(200).send('ERROR'));
                                                }).catch(err => res.status(200).send('ERROR'));
                                            }).catch(err => res.status(500).send({ message: err.message || "Some error occurred" }));
                                    }).catch(err => res.status(500).send({ message: err.message || "Some error occurred" }));
                            }).catch(err => res.status(500).send({ message: err.message || "Some error occurred" }));
                    }).catch(err => res.status(500).send({ message: err.message || "Some error occurred" }));
            }
        });
    } else res.status(403).send({ message: "NO JWT" });
};

exports.verifyJWT = (req, res) => {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        var token = bearerToken;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, authData) => {
            if (error) {
                res.status(200).send({ message: "EXPIRED" });
            } else {
                res.status(200).send('OK');
            }
        });
    } else {
        res.status(403).send({ message: "NO JWT" });
    }
};

exports.appResetPassConfirm = (req, res) => {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        var token = bearerToken;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, authData) => {
            if (error) {
                res.status(200).send({ message: "EXPIRED" });
            } else {

                const _password = req.body.password;
                const _email = req.body.email;

                var SHA256 = require("crypto-js/sha256");

                let passwordSalt = makeid(16);
                let passwordHash = SHA256(_password + passwordSalt).toString()


                const object = { passwordHash: passwordHash, passwordSalt: passwordSalt };

                BD_Users.logins.update(object, { where: { loginUser: _email } })
                    .then(lData => {
                        res.send('OK');
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while executing UPDATE."
                        });
                    });
            }
        });
    } else {
        res.status(403).send({ message: "NO JWT" });
    }
};

exports.verifyLogin = (req, res) => {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        var token = bearerToken;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, authData) => {
            if (error) {
                res.status(401).send({ message: "NO JWT KEY" });
            } else {
                BD_Users.notifications.findAll({ where: { userId: authData.user.id, check: 0 } })
                    .then(data => {
                        res.status(200).send({ message: "OK", data: data });

                    }).catch(err => { res.status(500).send({ message: err.message }) });
            }
        });
    } else {
        res.status(400).send({ message: "NO JWT" });
    }
};

exports.loadWorkers = (req, res) => {
    const dbIndex = req.params.dbIndex;
    BD_Users.query(queries.loadWorkers(dbIndex), { type: QueryTypes.SELECT })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred." });
        });
};

exports.loadCompanies = (req, res) => {
    const idUser = req.params.idUser;
    BD_Users.query(queries.loadCompanies(idUser), { type: QueryTypes.SELECT })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred." });
        });
};

exports.saveCompany = (req, res) => {
    const id_public = req.body.id_public;
    verifyPermit(req, 'ADMIN', 1)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const object = {
                name: req.body.name ? req.body.name : null,
                companyInfo: req.body.companyInfo ? req.body.companyInfo : null,
                technicalInfo: req.body.technicalInfo ? req.body.technicalInfo : null,
            }
            BD_Users.companies.update(object, { where: { id_public: id_public } })
                .then(num => {
                    if (num == 1) {
                        res.send('OK');
                    } else {
                        res.send(`ERROR_2`); // NO MATCHING ID
                    }
                })

        }).catch(err => res.status(200).send('NO PERMIT'));
};

exports.loadWorkerData = (req, res) => {
    const idUser = req.params.idUser;
    const dbIndex = req.params.dbIndex;
    BD_Users.query(queries.loadWorkerData(dbIndex, idUser), { type: QueryTypes.SELECT })
        .then(data => {
            res.send(data[0]);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred." });
        });
};

exports.update_profesional = (req, res) => {
    const superagent = require('superagent');

    superagent
        .post(`${process.env.PROF_URL}/api/profesionals/findorcreate`)
        .set('Authorization', process.env.PROF_API_KEY)
        .accept('application/json')
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.status(500).send({ message: err.message || "Some error occurred." });
        });
}

// THIS IS A SIMPLE SALT MAKER :)
function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&?!";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function GET_JSON_FULL(objec) {
    if (!objec) return {};
    let json = objec;
    let whileSafeBreaker = 0;
    while (typeof json !== 'object') {
        try {
            json = JSON.parse(json)
        } catch (error) {
            return false;
        }
        whileSafeBreaker++
        if (whileSafeBreaker == 10) return false;
    }
    return json
}