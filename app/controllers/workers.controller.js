const db = require("../models");
const jwt = require("jsonwebtoken");
const BD_Users = db.DBS['Database0'];
var queries = require('../resources/sqlQueries')
const { QueryTypes } = require('sequelize');
const { verifyPermit } = require("../resources/permits.controller");
const { corbanAudit } = require("../resources/audits.controller");

// CREATES A NEW WORKER_ROLE RELATIONS
exports.create = (req, res) => {
    verifyPermit(req, 'worker', 2)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            let object = {
                roleId: req.body.roleId,
                workerId: req.body.workerId,
            }

            BD_Users.roles_workers.create(object)
                .then(data => {
                    corbanAudit('create - worker_role', object, req)
                    res.send('OK');
                }).catch(err => { res.status(500).send({ message: err.message || "Some error occurred while CREATING DATA." }) });
        }).catch(err => res.send('NO PERMIT'));
};

exports.findAll = (req, res) => {
    verifyPermit(req, 'worker', 2)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const attributes_workers = ['id', 'active']
            const attributes_role_workers = ['id']
            const attributes_roles = ['name', 'roleInfo', 'permits', 'priority']
            const attributes_users = ['name', 'name_2', 'surname', 'surname_2']
            const companyPublicId = req.params.id_public

            console.log('YEAH IM HERE 1! ')
            BD_Users.workers.findAll({
                attributes: attributes_workers,
                include: [
                    {
                        model: BD_Users.roles_workers, attributes: attributes_role_workers,
                        include: [{
                            model: BD_Users.roles, attributes: attributes_roles, require: false,
                            where: { priority: { [db.Sequelize.Op.not]: '11' } },
                        }]
                    },
                    {
                        model: BD_Users.users, attributes: attributes_users
                    },
                    {
                        model: BD_Users.companies, attributes: [], where: { id_public: companyPublicId, active: 1 }
                    },
                ]
            })
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

// UPDATES A NEW WORKER_ROLE RELATIONS
exports.update = (req, res) => {
    verifyPermit(req, 'worker', 2)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const id = req.params.id;
            let object = {
                roleId: req.body.roleId,
                workerId: req.body.workerId,
            }

            BD_Users.roles_workers.update(object, {
                where: { id: id }
            }).then(num => {
                if (num == 1) {
                    corbanAudit('update - worker_role', object, req)
                    res.send('OK');
                } else {
                    res.send(`ERROR_2`); // NO MATCHING ID
                }
            })
        }).catch(err => res.send('NO PERMIT'));
};

exports.activate = (req, res) => {
    verifyPermit(req, 'worker', 3)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const id = req.params.id;
            let object = {
                active: req.body.active,
            }

            BD_Users.workers.update(object, {
                where: { id: id }
            }).then(num => {
                if (num == 1) {
                    corbanAudit('active - worker_role', object, req)
                    res.send('OK');
                } else {
                    res.send(`ERROR_2`); // NO MATCHING ID
                }
            })
        }).catch(err => res.send('NO PERMIT'));
};

// DELETES A WORKER_ROLE ENTRY
exports.delete = (req, res) => {
    verifyPermit(req, 'worker', 2)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const id = req.params.id;
            BD_Users.roles_workers.destroy({
                where: { id: id }
            })
                .then(num => {
                    if (num == 1) {
                        corbanAudit('delete - worker_role', id, req)
                        res.send('OK');
                    } else {
                        res.send(`ERROR_2`); // NO MATCHING ID
                    }
                })
        }).catch(err => res.send('NO PERMIT'));
};