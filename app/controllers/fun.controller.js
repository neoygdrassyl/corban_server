const db = require("../models");

const FUN_0 = (db) => db.fun_0;
const FUN_1 = (db) => db.fun_1;
const FUN_2 = (db) => db.fun_2;
const FUN_3 = (db) => db.fun_3;
const FUN_4 = (db) => db.fun_4;
const FUN_51 = (db) => db.fun_51;
const FUN_52 = (db) => db.fun_52;
const FUN_53 = (db) => db.fun_53;
const FUN_6 = (db) => db.fun_6;
const FUN_6_H = (db) => db.fun_6_h;
const FUN_C = (db) => db.fun_c;
const FUN_R = (db) => db.fun_r
const FUN_LAW = (db) => db.fun_law;
const FUN_CLOCK = (db) => db.fun_clock;
const FUN_ARCH = (db) => db.fun_archive;

const PH = (db) => db.record_ph;

const ARC = (db) => db.record_arc;
const ARCR = (db) => db.record_arc_38;
const ARC_STEP = (db) => db.record_arc_step;

const LAW = (db) => db.record_law;
const LAWR = (db) => db.record_law_review;
const LAW_STEP = (db) => db.record_law_step;

const ENG = (db) => db.record_eng;
const ENGR = (db) => db.record_eng_review;
const ENG_STEP = (db) => db.record_eng_step;

const RR = (db) => db.record_review;

const EXP = (db) => db.expedition;

const Op = db.Sequelize.Op;
var queries = require('../resources/sqlQueries');
const { QueryTypes } = require('sequelize');
const { validateDB, getDbData } = require("../resources/jwt.module");
const { verifyPermit } = require("../resources/permits.controller");

exports.findAll = (req, res) => {
    const dateStart = req.params.dateStart;
    const dateEnd = req.params.dateEnd;

    verifyPermit(req, 'fun', 1)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');

            const DB = validateDB(req);
            const f0_att = ['id_public', 'state', 'type', 'rules', 'tags'];
            const f1_att = ['tipo', 'tramite', 'm_urb', 'm_sub', 'm_lic'];
            const fclk_att = ['date_start', 'state', 'version', 'desc', 'resolver_context'];
            const flaw_att = ['sign', 'report_data'];
            const f3_att = ['state'];

            FUN_0(DB).findAll({
                attributes: f0_att,
                include: [
                    { model: FUN_1(DB), attributes: f1_att, required: false },
                    { model: FUN_3(DB), attributes: f3_att, required: false },
                    { model: FUN_LAW(DB), attributes: flaw_att, required: false },
                    {
                        model: FUN_CLOCK(DB), attributes: fclk_att, required: false, where: {
                            state: {
                                [Op.or]: [
                                    '3', // PAGO FIJOS
                                    '5',  //LDF
                                    //  VERSIONS => 1: REVIEW, 100: ASIGNACION, 200: REVIEW, 300: NOTIFICACION
                                    '11', // REVISION JURIDICA
                                    '12', // REVISION ESTRUCTURAL
                                    '13', // REVISION ARQUITECTONICA 
                                    '14', // REVISION ph 
                                    '30', // ACTA PARTE 1
                                    '49', // ACTA PARTE 2
                                    '61', // ACTO DE VIABILIDAD
                                    '69', // PAGOS VARIABLE.... NICE!
                                    //'99',  // LICENCIA EXPEDIDA // DEPRECIATED
                                    '100', // LICENCIA EXPEDIDA
                                    '101', // ARCHIVADO
                                    '200' // CERRADO
                                ]
                            }
                        }
                    }
                ]
            })
                .then(data => {
                    res.send(data);
                })
                .catch(err => { res.status(500).send({ message: err.message || "Some error occurred while retrieving ALL DATA." }); });
        }).catch(err => res.send('NO PERMIT'));
};

exports.create = (req, res) => {
    verifyPermit(req, 'fun', 2)
        .then(isAllowed => {
            if (!isAllowed) return res.send('NO PERMIT');
            const DB = validateDB(req);

            const id_public = (req.body.id_public ? req.body.id_public : res.send('NOT A REAL ID'));
            const object = {
                id_public: id_public,
                type: (req.body.type ? req.body.type : null),
                date: (req.body.date ? req.body.date : null),
                model: (req.body.model ? req.body.model : null),
                tags: (req.body.tags ? req.body.tags : null),
                state: 1,
                version: 1,
            };

            FUN_0(DB).findOne({ where: { id_public: id_public } })
                .then(data => {
                    if (data) res.send("ERROR_DUPLICATE");
                    FUN_0(DB).create(object)
                        .then(data => {
                            const object_f1 = {
                                fun0Id: data.id,
                                description: (req.body.description ? req.body.description : null),
                            };
                            FUN_1(DB).create(object_f1)
                                .then(data_f1 => {
                                    res.send('OK')

                                }).catch(err => { res.status(500).send({ message: err.message || "Some error occurred" }); });
                        }).catch(err => { res.status(500).send({ message: err.message || "Some error occurred" }); });
                }).catch(err => { res.status(500).send({ message: err.message || "Some error occurred" }); });
        }).catch(err => res.send('NO PERMIT'));
};

exports.getGeneral = (req, res) => {
    const dbIndex = req.params.dbIndex;
    if (!dbIndex) res.status(500).send({ message: "ERORR_100" });
    const DB = db.DBS[dbIndex];

    var object = {}

    const id = req.params.id;

    const FUN_0 = DB.fun_0;
    const FUN_1 = DB.fun_1;
    const FUN_2 = DB.fun_2;
    const FUN_3 = DB.fun_3;
    const FUN_4 = DB.fun_4;
    const FUN_51 = DB.fun_51;
    const FUN_52 = DB.fun_52;
    const FUN_53 = DB.fun_53;
    const FUN_6 = DB.fun_6;
    const FUN_C = DB.fun_c;
    const FUN_R = DB.fun_r
    const FUN_LAW = DB.fun_law;
    const FUN_CLOCK = DB.fun_clock;
    const FUN_ARCH = DB.fun_archive;

    const PH = DB.record_ph;
    const ARC = DB.record_arc;
    const ARCR = DB.record_arc_38;
    const LAW = DB.record_law;
    const LAWR = DB.record_law_review;
    const ENG = DB.record_eng;
    const ENGR = DB.record_eng_review;

    get_FUN_0(id);

    function get_FUN_0(id) {
        FUN_0.findAll({ where: { id: id }, include: [PH, ARC, LAW, ENG] })
            .then(data => { object = data[0].dataValues; get_FUN_1(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_0 with ID=" + id + ':' + err }); });
    }

    function get_FUN_1(id) {
        FUN_1.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_1s'] = data; get_FUN_2(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_1 with ID=" + id }); });
    }

    function get_FUN_2(id) {
        FUN_2.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_2s'] = data; get_FUN_3(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_2 with ID=" + id }); });
    }

    function get_FUN_3(id) {
        FUN_3.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_3s'] = data; get_FUN_4(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_3 with ID=" + id }); });
    }

    function get_FUN_4(id) {
        FUN_4.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_4s'] = data; get_FUN_51(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_4 with ID=" + id }); });
    }

    function get_FUN_51(id) {
        FUN_51.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_51s'] = data; get_FUN_52(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_51 with ID=" + id }); });
    }

    function get_FUN_52(id) {
        FUN_52.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_52s'] = data; get_FUN_53(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_52 with ID=" + id }); });
    }

    function get_FUN_53(id) {
        FUN_53.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_53s'] = data; get_FUN_6(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_53 with ID=" + id }); });
    }

    function get_FUN_6(id) {
        FUN_6.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_6s'] = data; get_FUN_C(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_6 with ID=" + id }); });
    }

    function get_FUN_C(id) {
        FUN_C.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_cs'] = data; get_FUN_R(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_C with ID=" + id }); });
    }

    function get_FUN_R(id) {
        FUN_R.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_rs'] = data; get_FUN_LAW(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_R with ID=" + id }); });
    }

    function get_FUN_LAW(id) {
        FUN_LAW.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_laws'] = data; get_FUN_CLOCK(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_LAW with ID=" + id }); });
    }

    function get_FUN_CLOCK(id) {
        FUN_CLOCK.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_clocks'] = data; get_FUN_ARCH(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_CLOCK with ID=" + id }); });
    }

    function get_FUN_ARCH(id) {
        FUN_ARCH.findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_archives'] = data; get_LAWR(object); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_ARCH with ID=" + id }); });
    }

    function get_LAWR(object) {
        if (object.record_law) {
            LAWR.findAll({ where: { recordLawId: object.record_law.id } })
                .then(data => { object['record_law_reviews'] = data; get_ARCR(object); })
                .catch(err => { res.status(500).send({ message: "Error retrieving LAWR with ID=" + id }); });
        } else {
            get_ARCR(object)
        }
    }

    function get_ARCR(object) {
        if (object.record_arc) {
            ARCR.findAll({ where: { recordArcId: object.record_arc.id } })
                .then(data => { object['record_arc_38s'] = data; get_ENGR(object); })
                .catch(err => { res.status(500).send({ message: "Error retrieving ARCR with ID=" + id }); });
        } else {
            get_ENGR(object)
        }
    }

    function get_ENGR(object) {
        if (object.record_eng) {
            ENGR.findAll({ where: { recordEngId: object.record_eng.id } })
                .then(data => { object['record_eng_reviews'] = data; callBack(object); })
                .catch(err => { res.status(500).send({ message: "Error retrieving ENGR with ID=" + id }); });
        } else {
            callBack(object)
        }
    }

    function callBack(object) {
        console.log('RETRIEVEING: GEN FOR FUN ', id)
        res.json(object);
    }

};

exports.findOneIdPublic = (req, res) => {
    const DB = validateDB(req);
    const _id_public = req.params.id_public;
    var object = {}

    get_FUN_0(_id_public);

    function get_FUN_0(id) {
        FUN_0(DB).findAll({
            where: { id_public: id }, include: [PH(DB), RR(DB),
            { model: ARC(DB), include: ARCR(DB) },
            { model: LAW(DB), include: LAWR(DB) },
            { model: ENG(DB), include: ENGR(DB) }]
        })
            .then(data => { object = data[0].dataValues; get_FUN_1(object['id']); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_0 with ID=" + id + ':' + err }); });
    }

    function get_FUN_1(id) {
        FUN_1(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_1s'] = data; get_FUN_2(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_1 with ID=" + id }); });
    }

    function get_FUN_2(id) {
        FUN_2(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_2'] = data[0]; get_FUN_3(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_2 with ID=" + id }); });
    }

    function get_FUN_3(id) {
        FUN_3(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_3s'] = data; get_FUN_4(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_3 with ID=" + id }); });
    }

    function get_FUN_4(id) {
        FUN_4(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_4s'] = data; get_FUN_51(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_4 with ID=" + id }); });
    }

    function get_FUN_51(id) {
        FUN_51(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_51s'] = data; get_FUN_52(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_51 with ID=" + id }); });
    }

    function get_FUN_52(id) {
        FUN_52(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_52s'] = data; get_FUN_53(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_52 with ID=" + id }); });
    }

    function get_FUN_53(id) {
        FUN_53(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_53s'] = data; get_FUN_6(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_53 with ID=" + id }); });
    }

    function get_FUN_6(id) {
        FUN_6(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_6s'] = data; get_FUN_C(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_6 with ID=" + id }); });
    }

    function get_FUN_C(id) {
        FUN_C(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_cs'] = data; get_FUN_R(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_C with ID=" + id }); });
    }

    function get_FUN_R(id) {
        FUN_R(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_rs'] = data; get_FUN_LAW(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_R with ID=" + id }); });
    }

    function get_FUN_LAW(id) {
        FUN_LAW(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_law'] = data[0]; get_FUN_CLOCK(id); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_LAW with ID=" + id }); });
    }

    function get_FUN_CLOCK(id) {
        FUN_CLOCK(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_clocks'] = data; callBack(object); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_CLOCK with ID=" + id }); });
    }

    function get_FUN_ARCH(id) {
        FUN_ARCH(DB).findAll({ where: { fun0Id: id } })
            .then(data => { object['fun_archives'] = data; callBack(object); })
            .catch(err => { res.status(500).send({ message: "Error retrieving FUN_ARCH with ID=" + id + ' : ' + err }); });
    }

    function get_LAWR(object) {
        if (object.record_law.id) {
            LAWR(DB).findAll({ where: { recordLawId: object.record_law.id } })
                .then(data => { object.record_law.record_law_reviews = data; get_ARCR(object); })
                .catch(err => { res.status(500).send({ message: "Error retrieving LAWR with ID=" + id }); });
        } else {
            get_ARCR(object)
        }
    }

    function get_ARCR(object) {
        if (object.record_arc.id) {
            ARCR(DB).findAll({ where: { recordArcId: object.record_arc.id } })
                .then(data => { object.record_arc.record_arc_38s = data; get_ENGR(object); })
                .catch(err => { res.status(500).send({ message: "Error retrieving ARCR with ID=" + id }); });
        } else {
            get_ENGR(object)
        }
    }

    function get_ENGR(object) {
        if (object.record_eng.id) {
            ENGR(DB).findAll({ where: { recordEngId: object.record_eng.id } })
                .then(data => { object.record_eng.record_eng_reviews = data; callBack(object); })
                .catch(err => { res.status(500).send({ message: "Error retrieving ENGR with ID=" + id }); });
        } else {
            callBack(object)
        }
    }

    function callBack(object) {
        console.log('RETRIEVEING: GEN FOR FUN ', _id_public)
        res.json(object);
    }
};

exports.getLastIdPublic = (req, res) => {
    const DB = validateDB(req);

    getDbData(db.DBS['Database0'], DB.name).then(data => returnLastId(data));

    function returnLastId(data) {

        const { QueryTypes } = require('sequelize');
        var query = `
            SELECT MAX(fun_0s.id_public) AS id
            FROM fun_0s 
            WHERE fun_0s.id_public LIKE '${data.technicalInfo.serials.process}%'
            `;


        DB.query(query, { type: QueryTypes.SELECT })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while LAS ID FUN DATA [2]."
                });
            });
    }


};


exports.loadFun6Doc = (req, res) => {
    const DB = validateDB(req);
    const id = req.params.id;

    FUN_6(DB).findOne({ where: { id: id } })
        .then(data => {
            let dbPath = DB.name
            let path = data.path
            let file = data.filename
            let docExt = file.substring(file.lastIndexOf('.'), file.length);
            let docName = data.description + '.' + docExt;
            let docPath = __docsdir + dbPath + '/' + path + '/' + file;

            res.download(docPath, docName, (err) => {
                if (err) {
                    res.status(500).send({
                        message: "Could not download the file: " + docPath,
                    });
                } else {
                    console.log('Donwload for document: ', docPath)
                }
            });
        })
        .catch(err => { res.status(500).send({ message: "Error retrieving FUN6 with ID=" + id }); });


};
