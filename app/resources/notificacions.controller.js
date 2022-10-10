const db = require("../models");
const BD_Users = db.DBS['Database0'];
const moment = require('moment');
var queries = require('../resources/sqlQueries')
const { QueryTypes } = require('sequelize');

// CREATES A NEW NOTIFICACION FOR AN USER
exports.addNotification = (_email, _title, _info) => {
    BD_Users.users.findOne({
        include: [
            { model: BD_Users.logins, where: { loginUser: _email } }
        ]
    }).then(data => {

        let object = {
            date: moment().format('YYYY-MM-DD H:m'),
            check: 0,
            title: _title,
            notifInfo: JSON.stringify(_info),
            userId: data.id
        }

        BD_Users.notifications.create(object)
    })
}

// SETS AN ARRAYS OF _ids TO check = 1, MEANING THE USER HAS ALREADY SEE THEM 
exports.markNotifications = (req, res) => {
    const _ids = req.body.ids;

    var IDS = _ids ? _ids.split(',') : []

    IDS.map(id => BD_Users.notifications.update({ check: 1 }, { where: { id: id } }))
    res.status(200).send('OK');
}

// GET.
exports.findAll = (req, res) => {
    const _email = req.params.email;

    BD_Users.query(queries.loadLoginData(_email), { type: QueryTypes.SELECT })
        .then(data => {
            let user = data[0]
            BD_Users.notifications.findAll({ where: { userId: user.id, check: 0 }, attributes : ['title', 'notifInfo', 'date', 'id'] })
                .then(dataNots => {
                    res.send(dataNots);
                })
                .catch(err => { res.status(500).send({ message: err.message || "Some error occurred while retrieving ALL DATA." }); });
        }).catch(err => { res.status(500).send({ message: err.message || "Some error occurred while retrieving ALL DATA." }); });
};