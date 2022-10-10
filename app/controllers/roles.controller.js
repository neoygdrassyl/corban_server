const db = require("../models");
const BD_Users = db.DBS['Database0'];
const { verifyPermit } = require("../resources/permits.controller");
const { corbanAudit } = require("../resources/audits.controller");

exports.create = (req, res) => {
    verifyPermit(req, 'roles', 2)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');
            const dbId = req.headers['dbid'];
            BD_Users.companies.findOne({ where: { id_public: dbId } })
                .then(company => {

                    let object = {
                        name: req.body.name,
                        roleInfo: req.body.roleInfo,
                        companyId: company.id,
                        priority: req.body.priority ? req.body.priority : 1,
                    }

                    BD_Users.roles.create(object)
                        .then(data => {
                            corbanAudit('create - roles', object, req)
                            res.send('OK');
                        })
                        .catch(err => { res.status(500).send({ message: err.message || "Some error occurred while CREATING DATA." }) });
                })
                .catch(err => { res.status(500).send({ message: err.message || "Some error occurred while retrieving ONE DATA." }) });
        }).catch(err => res.send('NO PERMIT'));
};

exports.findAll = (req, res) => {
    verifyPermit(req, 'roles', 1)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');
            const dbId = req.params.dbId;
            const userId = req.params.userId;
            const attributes = ['id', 'name', 'roleInfo', 'permits', 'priority']

            BD_Users.roles.findAll({ attributes: attributes, where: { priority: { [db.Sequelize.Op.not]: '11' } }, include: { model: BD_Users.companies, where: { id_public: dbId }, attributes: [] } })
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

// THIS LIST IS MEANT TO THE WORKER PAGE, AND SO SHARES THE SAME PERMITS AT THE WORKER
exports.findAllCompany = (req, res) => {
    verifyPermit(req, 'worker', 1)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');
            const companyPublicId = req.params.id_public;
            const attributes = ['id', 'name', 'roleInfo', 'permits', 'priority']

            BD_Users.roles.findAll({ attributes: attributes, where: { priority: { [db.Sequelize.Op.not]: '11' } }, include: { model: BD_Users.companies, where: { id_public: companyPublicId }, attributes: [] } })
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

exports.update = (req, res) => {
    verifyPermit(req, 'roles', 3)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const id = req.params.id;
            BD_Users.roles.update(req.body, {
                where: { id: id }
            }).then(num => {
                if (num == 1) {
                    corbanAudit('update - roles', req.body, req)
                    res.send('OK');
                } else {
                    res.send(`ERROR_2`); // NO MATCHING ID
                }
            })
        }).catch(err => res.send('NO PERMIT'));
};

exports.delete = (req, res) => {
    verifyPermit(req, 'roles', 4)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const id = req.params.id;
            BD_Users.roles.destroy({
                where: { id: id }
            })
                .then(num => {
                    if (num == 1) {
                        corbanAudit('delete - roles', {id:id}, req)
                        res.send('OK');
                    } else {
                        res.send(`ERROR_2`); // NO MATCHING ID
                    }
                })
        }).catch(err => res.send('NO PERMIT'));
};