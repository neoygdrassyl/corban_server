const db = require("../models");
const Templates = (db) => db.templates;
const { verifyPermit } = require("../resources/permits.controller");
const { corbanAudit } = require("../resources/audits.controller");
const { validateDB } = require("../resources/jwt.module");

exports.create = (req, res) => {
    verifyPermit(req, 'templates', 2)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const DB = validateDB(req);

            let object = {
                template_name: req.body.template_name,
                template_data: req.body.template_data,
                template_type: req.body.template_type,
            }

            Templates(DB).create(object)
                .then(data => {
                    corbanAudit('create - templates', object, req)
                    res.send('OK');
                })
                .catch(err => { res.status(500).send({ message: err.message || "Some error occurred while CREATING DATA." }) });

        }).catch(err => res.send('NO PERMIT'));
};

exports.findAll = (req, res) => {
    verifyPermit(req, 'templates', 1)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const attributes = ['id', 'template_name', 'template_data', 'template_type']
            const DB = validateDB(req);

            Templates(DB).findAll({ attributes: attributes, })
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

exports.findAllByType = (req, res) => {
    const attributes = ['template_name', 'template_data']
    const DB = validateDB(req);
    const type = req.params.type

    Templates(DB).findAll({ attributes: attributes, where: { template_type: type } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving ALL DATA."
            });
        });
};

exports.update = (req, res) => {
    verifyPermit(req, 'templates', 3)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const DB = validateDB(req);
            const id = req.params.id;

            Templates(DB).update(req.body, {
                where: { id: id }
            }).then(num => {
                if (num == 1) {
                    corbanAudit('update - templates', req.body, req)
                    res.send('OK');
                } else {
                    res.send(`ERROR_2`); // NO MATCHING ID
                }
            })
        }).catch(err => res.send('NO PERMIT'));
};

exports.delete = (req, res) => {
    verifyPermit(req, 'templates', 4)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const DB = validateDB(req);
            const id = req.params.id;

            Templates(DB).destroy({
                where: { id: id }
            })
                .then(num => {
                    if (num == 1) {
                        corbanAudit('delete - templates', { id: id }, req)
                        res.send('OK');
                    } else {
                        res.send(`ERROR_2`); // NO MATCHING ID
                    }
                })
        }).catch(err => res.send('NO PERMIT'));
};