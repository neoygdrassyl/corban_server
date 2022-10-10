const db = require("../models");
const BD_Users = db.DBS['Database0'];
const { verifyPermit } = require("../resources/permits.controller");
const { corbanAudit } = require("../resources/audits.controller");

exports.create = (req, res) => {
    let object = {
        reporter: req.body.reporter,
        product: req.body.product,
        priority: req.body.browser,
        url: req.body.url,
        desc: req.body.desc,
        browser: req.body.browser,
        status: 'open',
        priority: 1,
    }

    BD_Users.bugs.create(object)
        .then(data => {
            res.send('OK');
        })
        .catch(err => { res.status(500).send({ message: err.message || "Some error occurred while CREATING DATA." }) });
};

exports.findAll = (req, res) => {
   
};


exports.update = (req, res) => {
    
};

exports.delete = (req, res) => {

};