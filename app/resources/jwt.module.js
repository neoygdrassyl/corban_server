const jwt = require("jsonwebtoken");
const db = require("../models");

exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    const dbIndex = req.headers['dbindex'];
    const dbId = req.headers['dbid'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        var token = bearerToken;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, authData) => {
            if (error) {
                res.status(401).send({ message: "NO JWT KEY", });
            } else {
                if (!dbId) res.status(403).send({ message: "NO INDEX DB" });
                console.log('UPDATE TOKEN: ', authData)
                var user = authData['user'] ? authData['user'] : authData
                var refreshUser = user;
                refreshUser.exp = undefined;
                refreshUser.iat = undefined;
                if (!refreshUser) res.status(403).send({ message: "NO USER DATA" });

                var technicalInfo = user.teamIds;
                if (technicalInfo.includes(dbId)) {
                    refreshToken(res, refreshUser, token => {
                        res.header({ 'content-jwt': token })
                        next();
                    })
                }
                else res.status(403).send({ message: "NO DB ALLOWED" });
            }
        });
    } else {
        res.status(401).send({ message: "NO JWT" });
    }
}


exports.verifyTokenUser = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        var token = bearerToken;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, authData) => {
            if (error) {
                res.status(401).send({ message: "NO JWT KEY" });
            } else {
                var user = authData['user'] ? authData['user'] : authData
                var refreshUser = user;
                refreshUser.exp = undefined;
                refreshUser.iat = undefined;
                if (!refreshUser) res.status(403).send({ message: "NO USER DATA" });

                refreshToken(res, refreshUser, token => {
                    res.header({ 'content-jwt': token })
                    next();
                })

            }
        });
    } else {
        res.status(401).send({ message: "NO JWT" });
    }
}

exports.validateDB = (req) => {
    const dbIndex = req.headers['dbindex'];
    if (!dbIndex) return res.status(500).send({ message: "ERORR 100 : DB INDEX" });
    const DB = db.DBS[dbIndex];
    return DB
}

exports.getDbData = (DB, name, cb) => {
    const { QueryTypes } = require('sequelize');
    var query = `
    SELECT name, companyInfo,  bdname, id_public, technicalInfo FROM companies WHERE bdname = '${name}'
    `;
    return DB.query(query, { type: QueryTypes.SELECT }).then(data => {
        let db = {
            name: data[0].name,
            bdname: data[0].bdname,
            id_public: data[0].id_public,
            companyInfo: GET_JSON_FULL(data[0].companyInfo),
            technicalInfo: GET_JSON_FULL(data[0].technicalInfo),
        }
        db.companyInfo.indexName = data[0].bdname;
        db.companyInfo.name = data[0].name;
        return db;
    })
        .catch(err => { return err });


}


function refreshToken(res, user, next) {
    jwt.sign({user}, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 20 }, (err, token) => {
        if (err) res.status(500).send({ message: err.message || "Some error occurred." });
        next(token)
    });
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