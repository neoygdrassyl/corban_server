const db = require("../models");
const BD_Users = db.DBS['Database0'];

const Audits = (db) => db.audits;
const jwt = require("jsonwebtoken");
const { verifyPermit } = require("../resources/permits.controller");
const { validateDB } = require("../resources/jwt.module");

exports.corbanAudit = (event, data, req) => {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        var token = bearerToken;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, authData) => {
            if (!error) {
                let owner = req.headers['dbid'];
                let jwtData = authData.user
                let user = {}
                user.id = jwtData.id
                user.name = jwtData.name + ' '+jwtData.name_2
                user.surname = jwtData.surname + ' '+jwtData.surname_2
                let obj = {
                    event: event,
                    owner: owner,
                    userInfo:  JSON.stringify(user),
                    auditInfo: JSON.stringify(data)
                }
                BD_Users.audits.create(obj)
            }
        });
    }
}


exports.dobelaAudit = (event, data, DB, req) => {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        var token = bearerToken;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, authData) => {
            if (!error) {
                let jwtData = authData.user
                let user = {}
                user.id = jwtData.id
                user.name = jwtData.name + ' '+jwtData.name_2
                user.surname = jwtData.surname + ' '+jwtData.surname_2
                let obj = {
                    event: event,
                    userInfo:  JSON.stringify(user),
                    auditInfo: JSON.stringify(data)
                }
                DB.audits.create(obj)
            }
        });
    }
}

exports.findAllTeam = (req, res) => {
    verifyPermit(req, 'ADMIN', 1)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');
            
            const DB = validateDB(req);
            const attributes = ['event', 'auditInfo', 'userInfo', 'createdAt']

            Audits(DB).findAll({ attributes: attributes })
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving ALL DATA."
                    });
                });
        }).catch(err => res.send('NO PERMIT'));
};

exports.findAllApp = (req, res) => {
    verifyPermit(req, 'ADMIN', 1)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');
            
            let owner = req.headers['dbid'];
            const attributes = ['event', 'auditInfo', 'userInfo', 'createdAt']

            BD_Users.audits.findAll({ attributes: attributes, where: {owner: owner} })
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving ALL DATA."
                    });
                });
        }).catch(err => res.send('NO PERMIT'));
};