const db = require("../models");
const BD_Users = db.DBS['Database0'];

const CERT = (db) => db.certification;

const FUN_0 = (db) => db.fun_0;
const FUN_1 = (db) => db.fun_1;
const FUN_2 = (db) => db.fun_2;
const FUN_52 = (db) => db.fun_52;
const FUN_53 = (db) => db.fun_53;
const FUN_CLOCK = (db) => db.fun_clock;

const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;

const { validateDB, getDbData } = require("../resources/jwt.module");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { QueryTypes } = require('sequelize');
const pdfSupport = require("../resources/pdf.lib.js");
const { download } = require("./files.controller");
const { GET_JSON_FULL, FORMAT_NUMBER, convertBase, GET_FUN_STATE } = require("../resources/lamdas.fn");

const moment = require('moment');
let enLocale = require('moment/locale/es');
let esLocale = require('moment/locale/es');
const { formsParser1 } = require("../resources/funParser");
const { loadCompanieData } = require("../resources/sqlQueries");
const { corbanAudit } = require("../resources/audits.controller");

exports.findAll = (req, res) => {
    const DB = validateDB(req);

    const attributes = ['id_public', 'content', 'description', 'id_related', 'related', 'createdAt'];

    CERT(DB).findAll({
        attributes: attributes,
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving DATA." });
        });
};

exports.findOne = (req, res) => {
    const DB = validateDB(req);
    const id = req.params.id

    const attributes = ['id_public', 'content', 'description', 'id_related', 'related', 'createdAt'];

    CERT(DB).findOne({
        attributes: attributes, where: { id: id }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving DATA." });
        });
};

exports.findOneOc = (req, res) => {
    const DB = validateDB(req);
    const oc = req.params.oc

    const attributes = ['id_public', 'content', 'description', 'id_related', 'related', 'createdAt'];

    CERT(DB).findOne({
        attributes: attributes, where: { id_public: oc }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving DATA." });
        });
};

exports.findAllRelated = (req, res) => {
    const DB = validateDB(req);
    const idr = req.params.idr

    const attributes = ['id_public', 'content', 'description', 'id_related', 'related', 'createdAt'];

    CERT(DB).findAll({
        attributes: attributes, where: { id_related: idr }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving DATA." });
        });
};

exports.findProf = (req, res) => {
    const DB = validateDB(req);

    const attributes = ['id_public', 'content', 'description', 'id_related', 'related', 'createdAt'];

    CERT(DB).findAll({
        attributes: attributes,
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving DATA." });
        });
};

exports.findFun = (req, res) => {
    const DB = validateDB(req);

    const attributes = ['id_public', 'content', 'description', 'id_related', 'related', 'createdAt'];

    CERT(DB).findAll({
        attributes: attributes,
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving DATA." });
        });
};

exports.findDataProf = (req, res) => {
    const id_number = req.params.id_number ? req.params.id_number : res.status('ERROR');
    FIND_52_PROF(id_number, req, res, (data) => res.send(data))
};

exports.findDataProfs = (req, res) => {
    const DB = validateDB(req);
    const name = req.params.name ? req.params.name : res.status('ERROR');

    const f52_att = ['name', 'surname', 'id_number', 'registration',];
    const f1_att = ['tipo', 'tramite', 'm_urb', 'm_sub', 'm_lic']

    let OPnames = name.split(' ').map(n => { return { [Op.like]: `%${n}%` } });

    FUN_52(DB).findAll({
        attributes: f52_att, group: ['id_number'],
        include: [
            {
                model: FUN_0(DB), attributes: [[Sequelize.fn('GROUP_CONCAT', Sequelize.literal(`DISTINCT id_public SEPARATOR ','`)), 'id_public']],
            }
        ],
        where: {
            [Op.or]: [
                {
                    id_number: {
                        [Op.ne]: null,
                        [Op.like]: FORMAT_NUMBER(name.replace(/^\D+/g, '')),
                    }
                },
                {
                    name: {
                        [Op.or]: [
                            { [Op.like]: `%${name}%` },
                            ...OPnames
                        ]
                    }
                },
                {
                    surname: {
                        [Op.or]: [
                            { [Op.like]: `%${name}%` },
                            ...OPnames
                        ]
                    }
                },
            ],
        }
    })
        .then(data => {
            res.send(data);
        }).catch(err => res.status(500).send({ message: err.message || "Some error occurred." }));
};

exports.findDataFun = (req, res) => {
    const id_public = req.params.id_public ? req.params.id_public : res.status('ERROR');
    FIND_0_FUN(id_public, req, res, (data) => res.send(data))
};


exports.create = (req, res) => {
    const DB = validateDB(req);
    const related = req.body.related ? req.body.related : res.status('ERROR');  // prof || fun  
    const id_related = req.body.id_related ? req.body.id_related : null;
    const id = req.body.id ? req.body.id : null;
    const lang = req.body.lang ? req.body.lang : 'en';


    if (related == 'prof') {
        FIND_52_PROF(id, req, res, (data) => {

            var name = String(data[0].name + ' ' + data[0].surname).toUpperCase();
            var genID = moment().format('MMDDHHmmss');
            var base32ID = convertBase(genID, 10, 32);
            var id_number = 'OC ' + moment().format('YY-') + base32ID;

            const description = {
                en: `PROFESSIONAL CERTIFICATION: ${name}`,
                es: `CERTIFICACIÓN DE PROFESIONAL: ${name}`
            }
            const content = JSON.stringify(data);

            const object = {
                id_public: id_number,
                description: description[lang],
                content: content,
                id_related: id_related,
                related: related,
            }
            create(object)
        })
    }
    if (related == 'fun') {
        FIND_0_FUN(id, req, res, (data) => {

            var genID = moment().format('MMDDHHmmss');
            var base32ID = convertBase(genID, 10, 32);
            var id_number = 'OC ' + moment().format('YY-') + base32ID;

            const description = {
                en: `CERTIFICATION OF URBAN PROCESS: ${id}`,
                es: `CERTIFICACIÓN DE ACTUACIÓN URBANÍSTICA: ${id}`
            }
            const content = JSON.stringify(data);

            const object = {
                id_public: id_number,
                description: description[lang],
                content: content,
                id_related: id_related,
                related: related,
            }
            create(object)
        })
    }
    function create(object) {
        CERT(DB).create(object)
            .then(data => {
                corbanAudit('create - certification', object, req)
                res.send('OK');
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Some error occurred" });
            });
    }
};


exports.genPDF = (req, res) => {
    const DB = validateDB(req);
    const oc = req.body.oc

    getDbData(BD_Users, DB.name).then(info => {
        if (!info) return res.send('ERROR');
        CERT(DB).findOne({ where: { id_public: oc } })
            .then(data => {
                let DATA = data
                DATA.lang = req.body.lang ? req.body.lang : 'en';
                DATA.companyInfo = info.companyInfo
                DATA.technicalInfo = info.technicalInfo

                DATA.path = '/docs/public/output_cert.pdf'
                if (DATA.related == 'fun') _genPDF_2(DATA);
                else _genPDF_1(DATA);
                const fileName = req.body.docname;
                const path = DATA.path
                setTimeout(() => download(res, path, fileName), 1000);

            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Some error occurred while retrieving DATA." });
            });
    }).catch(err => res.send('ERROR: ' + err));
};


function _genPDF_1(DATA) {
    var doc = new PDFDocument({
        size: 'LETTER', margins: {
            top: 120,
            bottom: 60,
            left: 56,
            right: 56
        },
        bufferPages: true,
    });

    let lang = DATA.lang;

    let content = GET_JSON_FULL(DATA.content)
    let name = content[0].name + ' ' + content[0].surname;
    let id_number = content[0].id_number;
    let registration = content[0].registration;
    let city = DATA.companyInfo.city || 'CIUDAD';
    let nomen = DATA.companyInfo.nomenclature || '0'
    let page = DATA.companyInfo.page || '//https:'
    let sign_concent = DATA.technicalInfo.concent ? DATA.technicalInfo.concent.certs : 0;
    let artcile = DATA.companyInfo.artcile || 'El';
    let job = DATA.companyInfo.job || 'CURADOR URBANO'

    const BODY = {
        en: `In use of its legal powers granted by Municipal Decree No. 0070 of June 4, 2021 and the
        Possession Act No. 0125 of June 7, 2021, Law 400 of 1997, Decree 1077 of 2015 of the
        Ministry of Housing, City and Territory and Resolution number 0015 of October 15, 2015 of the
        Permanent Advisory Commission of the regime of earthquake-resistant constructions,`.replace(/[\n\r]+ */g, ' '),
        es: `En uso de sus facultades legales otorgadas por el Decreto Municipal No. 0070 del 4 de Junio de 2021 y el
        Acta de Posesión No 0125 del 7 de Junio de 2021, ley 400 de 1997, el Decreto 1077 de 2015 del
        Ministerio de Vivienda, Ciudad y Territorio y La Resolución número 0015 de 15 de octubre de 2015 de la
        Comisión Asesora Permanente del régimen de construcciones Sismo resistentes,`.replace(/[\n\r]+ */g, ' '),
    }

    const BODY2 = {
        en: `Consulted the database of the Urban Curatorship  ${nomen} of ${city}, Mr./Mrs. ${name}
        identified with the citizenship ID number ${id_number}, in his capacity as architect/engineer with professional registration ${registration},
        appears as a professional in the following request(s) for urban planning action(s),`.replace(/[\n\r]+ */g, ' '),
        es: `Consultada la base de datos de la Curaduría urbana ${nomen} de ${city} el/la señor(a) ${name}
        identificado con la cédula de ciudadanía número ${id_number}, en su calidad de arquitecto/ingeniero con matrícula profesional ${registration}, 
        figura como profesional en la(s) siguiente(s) solicitud(es) de actuacion(es) urbanística(s),`.replace(/[\n\r]+ */g, ' ')
    }

    const BODY3 = {
        en: `The scope of this certification corresponds to indicating that the professional participated in the urban licensing process and
        His name, professional registration and signature is recorded on the single national form with which the application was processed and is the
        responsible for the technical documents of the quality in which he acts and the information contained therein.`.replace(/[\n\r]+ */g, ' '),
        es: `El alcance de esta certificación corresponde a señalar que el profesional participó en el proceso de licenciamiento urbanístico y
        su nombre, matricula profesional y firma está consignada en el formulario único nacional con el cual se tramitó la solicitud y es el
        responsable de los documentos técnicos propios de la calidad en que actúa y de la información contenido en ellos.`.replace(/[\n\r]+ */g, ' ')
    }

    const BODY4 = {
        en: `It is noted that this certification does not create any type of labor or civil obligation towards the professional,
        nor against third parties, by the undersigned; nor does it indicate, accredit or validate the
        professional experience that, according to the aforementioned regulations, is the responsibility of the National Professional Councils of
        Engineering (COPNIA) and Architecture (CPNAA) the respective validation.`.replace(/[\n\r]+ */g, ' '),
        es: `Se advierte que la presente certificación no crea ningún tipo de obligación laboral o civil frente al profesional, 
        ni frente a terceros, por parte del suscrito; tampoco señala, acredita o valida la 
        experiencia profesional que según la precitada normatividad, es competencia de los Consejos nacionales profesionales de 
        Ingeniera (COPNIA) y de Arquitectura (CPNAA) la respectiva validación.`.replace(/[\n\r]+ */g, ' ')
    }



    let trn = {
        en: {
            title: `PROFESSIONAL CERTIFICATION: ${name}`,
            actioner: `THE ${job.toUpperCase()} OF ${city}`,
            cert: 'CERTIFIES:',
            th: ['Application', 'Urban Planning Action', 'Filing Date', 'Issue Date', 'In the capacity of:'],
            issue: `Iussed at ${city} the ${moment(DATA.createdAt).format('D')} days of the month of ${moment(DATA.createdAt).locale('en').format('MMMM')} in the year ${moment(DATA.createdAt).format('yyyy')}.`,
            verify: `You can verify the integrity and inalterability of this certification by consulting the website ${page} indicating the certificate number found in the upper left corner of this document.`
        },
        es: {
            title: `CERTIFICACION DE PROFESIONAL: ${name}`,
            actioner: `${artcile.toUpperCase()} ${job.toUpperCase()} DE ${city}`,
            cert: 'CERTIFICA QUE:',
            th: ['Solicitud', 'Actuación Urbanística', 'Fecha Radicación', 'Fecha Expedición', 'En calidad de:'],
            issue: `Dada en ${city} a los ${moment(DATA.createdAt).format('D')} días del mes de ${moment(DATA.createdAt).locale('es', esLocale).format('MMMM')} del año ${moment(DATA.createdAt).format('yyyy')}.`,
            verify: `Podrá verificar la integridad e inalterabilidad de la presente certificación consultando en el sitio web ${page} indicando el número de certificado que se encuentra en la esquina superior izquierda de este documento.`
        }
    }

    doc.pipe(fs.createWriteStream('.' + DATA.path));

    doc.startPage = doc.bufferedPageRange().count - 1;
    doc.lastPage = doc.bufferedPageRange().count - 1;
    doc.on('pageAdded', () => { doc.startPage++; doc.lastPage++ });

    doc.fontSize(10);
    doc.font('Helvetica-Bold')
    doc.moveDown();
    doc.text(trn[lang].actioner, { align: 'center' });
    doc.font('Helvetica')
    doc.moveDown();
    doc.text(BODY[lang], { align: 'justify' });
    doc.font('Helvetica-Bold')
    doc.moveDown();
    doc.text(trn[lang].cert, { align: 'center' });
    doc.moveDown();
    doc.moveDown();
    doc.font('Helvetica')
    doc.text(BODY2[lang], { align: 'justify' });
    doc.font('Helvetica-Bold')
    doc.moveDown();
    doc.fontSize(7);

    pdfSupport.table(doc,
        [
            { coord: [0, 0], w: 60, h: 1, text: trn[lang].title, config: { align: 'center', fill: 'silver', bold: true } },
        ],
        [doc.x, doc.y], [60, 1], { lineHeight: -1 })
    pdfSupport.table(doc,
        [
            { coord: [0, 0], w: 10, h: 1, text: trn[lang].th[0], config: { align: 'center', fill: 'gainsboro', bold: true } },
            { coord: [10, 0], w: 17, h: 1, text: trn[lang].th[1], config: { align: 'center', fill: 'gainsboro', bold: true } },
            { coord: [27, 0], w: 8, h: 1, text: trn[lang].th[2], config: { align: 'center', fill: 'gainsboro', bold: true } },
            { coord: [35, 0], w: 8, h: 1, text: trn[lang].th[3], config: { align: 'center', fill: 'gainsboro', bold: true } },
            { coord: [43, 0], w: 17, h: 1, text: trn[lang].th[4], config: { align: 'center', fill: 'gainsboro', bold: true } },
        ],
        [doc.x, doc.y], [60, 1], { lineHeight: -1 })
    content.map(cnt => pdfSupport.table(doc,
        [
            { coord: [0, 0], w: 10, h: 1, text: cnt.id_public, config: { align: 'center', valign: true, } },
            { coord: [10, 0], w: 17, h: 1, text: getFun1(cnt.fun_1, lang), config: { align: 'center', valign: true, } },
            { coord: [27, 0], w: 8, h: 1, text: getDates(cnt)[0], config: { align: 'center', valign: true, } },
            { coord: [35, 0], w: 8, h: 1, text: getDates(cnt)[1], config: { align: 'center', valign: true, } },
            { coord: [43, 0], w: 17, h: 1, text: cnt.roles, config: { align: 'center', valign: true, } },
        ],
        [doc.x, doc.y], [60, 1], { lineHeight: -1 }))

    doc.fontSize(10);
    doc.moveDown();
    doc.text(BODY3[lang], { align: 'justify' });
    doc.moveDown();
    doc.text(BODY4[lang], { align: 'justify' });
    doc.moveDown();
    doc.text(trn[lang].issue);
    doc.moveDown();
    doc.font('Helvetica-Bold')
    pdfSupport.setSign(doc, sign_concent, DATA.companyInfo, lang);
    doc.fontSize(6);
    doc.moveDown();
    doc.font('Helvetica-Oblique')
    doc.text(trn[lang].verify);

    pdfSupport.setHeader(doc, { title: trn[lang].title, icon: true, id_public: DATA.id_public }, DATA.companyInfo, lang);
    pdfSupport.setBottom(doc, false, true, false, DATA.companyInfo, lang);


    doc.end();
    return true;

}

function _genPDF_2(DATA) {
    var doc = new PDFDocument({
        size: 'LETTER', margins: {
            top: 120,
            bottom: 60,
            left: 56,
            right: 56
        },
        bufferPages: true,
    });

    let lang = DATA.lang;

    let content = GET_JSON_FULL(DATA.content)
    let name = content.name;
    let id_number = content.id_number;
    let matricula = content.matricula;
    let city = DATA.companyInfo.city || 'CIUDAD';

    let page = DATA.companyInfo.page || '//https:'
    let sign_concent = DATA.technicalInfo.concent ? DATA.technicalInfo.concent.certs : 0;
    let artcile = DATA.companyInfo.artcile || 'El';
    let job = DATA.companyInfo.job || 'CURADOR URBANO'

    const BODY = {
        en: `That Mr. ${name} with citizenship card ID ${id_number} as ${content.role},
        is processing the application with filing No. ${DATA.id_related} of ${getFun1(content.type, lang)} in the property located at ${content.address} of the Municipality of ${city}
        according to Real Estate Registration Sheet No. ${matricula} of the Office of Public Instruments of ${city} or according to the responsible entity,
        with catastral number N° ${content.catastral_2 || content.catastral}, which is found in ${GET_FUN_STATE(content.state, lang)}.`.replace(/[\n\r]+ */g, ' '),
        es: `Que el/la señor(a) ${name} con cédula de ciudadanía N° ${id_number} en calidad de ${content.role}, 
        se encuentra tramitando la solicitud con radicado N° ${DATA.id_related} de ${getFun1(content.type, lang)} en el predio ubicado en la ${content.address} del Municipio de ${city} 
        según folio de Matrícula Inmobiliaria N° ${matricula} de la Oficina de Instrumentos Públicos de ${city} o según la entidad responsable, 
        con número catastral N° ${content.catastral_2 || content.catastral}, la cual se encuentra en ${GET_FUN_STATE(content.state, lang)}.`.replace(/[\n\r]+ */g, ' '),
    }



    let trn = {
        en: {
            title: `CERTIFICATION OF URBAN PROCESS`,
            actioner: `THE ${job.toUpperCase()} OF ${city}`,
            cert: 'CERTIFIES:',
            issue: `Iussed at ${city} the ${moment(DATA.createdAt).format('D')} days of the month of ${moment(DATA.createdAt).locale('en').format('MMMM')} in the year ${moment(DATA.createdAt).format('yyyy')}.`,
            verify: `You can verify the integrity and inalterability of this certification by consulting the website ${page} indicating the certificate number found in the upper left corner of this document.`
        },
        es: {
            title: `CERTIFICACIÓN DE ACTUACIÓN URBANÍSTICA`,
            actioner: `${String(artcile).toUpperCase()} ${job.toUpperCase()} DE ${city}`,
            cert: 'CERTIFICA QUE:',
            issue: `Dada en ${city} a los ${moment(DATA.createdAt).format('D')} días del mes de ${moment(DATA.createdAt).locale('es', esLocale).format('MMMM')} del año ${moment(DATA.createdAt).format('yyyy')}.`,
            verify: `Podrá verificar la integridad e inalterabilidad de la presente certificación consultando en el sitio web ${page} indicando el número de certificado que se encuentra en la esquina superior izquierda de este documento.`
        }
    }

    doc.pipe(fs.createWriteStream('.' + DATA.path));

    doc.startPage = doc.bufferedPageRange().count - 1;
    doc.lastPage = doc.bufferedPageRange().count - 1;
    doc.on('pageAdded', () => { doc.startPage++; doc.lastPage++ });

    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.moveDown();
    doc.text(trn[lang].actioner, { align: 'center' });
    doc.font('Helvetica')
    doc.moveDown();
    doc.text(trn[lang].cert, { align: 'center' });
    doc.moveDown();
    doc.font('Helvetica')
    doc.fontSize(12)
    doc.text(BODY[lang], { align: 'justify' });

    doc.text('\n');
    doc.text(trn[lang].issue);

    pdfSupport.setSign(doc, sign_concent, DATA.companyInfo, lang);
    pdfSupport.setHeader(doc, { title: trn[lang].title, icon: true, id_public: DATA.id_public }, DATA.companyInfo, lang);
    pdfSupport.setBottom(doc, false, true, false, DATA.companyInfo, lang);


    doc.end();
    return true;

}

let getDates = (element) => {
    var state = element.states ? element.states.split(',') : [];
    var date = element.dates ? element.dates.split(',') : [];
    var date_start = '';
    var date_end = '';
    if (state.length) {
        if (state.includes('-1')) {
            var indexOf = state.indexOf('-1');
            date_start = date[indexOf];
        }
        if (state.includes('3')) {
            var indexOf = state.indexOf('3');
            date_start = date[indexOf];
        }
        if (state.includes('5')) {
            var indexOf = state.indexOf('5');
            date_start = date[indexOf];
        }
        if (state.includes('100')) {
            var indexOf = state.indexOf('100');
            date_end = date[indexOf]
        }
    }
    return [date_start, date_end]
}

let getFun1 = (element, lang) => {
    var type = element ? element.split('&') : [];
    var suType = type[type.length - 1] ? type[type.length - 1].split(';') : [];
    var typeObject = {
        tipo: suType[0],
        tramite: suType[1],
        m_urb: suType[2],
        m_sub: suType[3],
        m_lic: suType[4]
    }

    return formsParser1(typeObject, lang);
}

function FIND_52_PROF(id_number, req, res, cb) {
    const DB = validateDB(req);

    const f52_att = ['name', 'surname', 'id_number', 'registration', 'role'];
    const f1_att = ['tipo', 'tramite', 'm_urb', 'm_sub', 'm_lic'];
    const f0_att = [[Sequelize.fn('GROUP_CONCAT', Sequelize.literal(`DISTINCT id_public SEPARATOR ','`)), 'id_public']];
    const fc_att = ['date_start', 'state']

    FUN_52(DB).findOne({
        attributes: f52_att, group: ['id_number'],
        include: [{ model: FUN_0(DB), attributes: f0_att, }],
        where: { id_number: id_number },
    })
        .then(data_f52 => {
            let ids = data_f52.fun_0.id_public.split(',');
            FUN_0(DB).findAll({
                attributes: ['id_public'],
                include: [
                    { model: FUN_1(DB), attributes: f1_att, required: false },
                    { model: FUN_52(DB), attributes: f52_att, where: { id_number: id_number } },
                    { model: FUN_CLOCK(DB), attributes: fc_att, where: { state: { [Op.or]: [5, 100] } }, required: false },
                ],
                where: { id_public: { [Op.or]: ids } },
            })
                .then(data_f0 => {
                    if (!data_f0) return res.send('NO DATA');

                    let content = data_f0.map(f0 => {
                        let f52 = f0.fun_52s;
                        let f1 = f0.fun_1s;
                        let fc = f0.fun_clocks;

                        return {
                            id_public: f0.id_public,
                            id_number: f52[0].id_number,
                            name: f52[0].name,
                            surname: f52[0].surname,
                            registration: f52[0].registration,
                            roles: f52.map(f => f.role).join(', '),

                            fun_1: f1[0]
                                ? `${f1[0].tipo || ''};${f1[0].tramite || ''};${f1[0].m_urb || ''};${f1[0].m_sub || ''};${f1[0].m_lic || ''}`
                                : ';;;;'
                            ,

                            states: fc.map(f => f.state).join(','),
                            dates: fc.map(f => f.date_start).join(','),
                        }

                    })

                    cb(content);


                }).catch(err => res.status(500).send({ message: err.message || "Some error occurred." }));
        }).catch(err => res.status(500).send({ message: err.message || "Some error occurred." }));
}

function FIND_0_FUN(id_public, req, res, cb) {
    const DB = validateDB(req);
    const team = req.headers['dbid'];

    const f0_att = ['state', 'id_public'];
    const f2_att = ['direccion', 'direccion_ant', 'matricula', 'catastral', 'catastral_2'];
    const f1_att = ['tipo', 'tramite', 'm_urb', 'm_sub', 'm_lic'];
    const f53_att = ['name', 'surname', 'id_number', 'role'];

    BD_Users.query(loadCompanieData(team), { type: QueryTypes.SELECT })
        .then(teamData => {

            let team = teamData[0];
            if (teamData.length == 0) return res.status(200).send("NOT TEAM");
            if (team.active != 1) return res.status(200).send("NOT ACTIVE TEAM");

            let companyInfo = GET_JSON_FULL(team.companyInfo);
            let county = companyInfo.state || '';
            let city = companyInfo.city || '';

            FUN_0(DB).findOne({
                attributes: f0_att,
                where: { id_public: id_public },
                include: [
                    { model: FUN_2(DB), attributes: f2_att, required: false },
                    { model: FUN_1(DB), attributes: f1_att, required: false },
                    { model: FUN_53(DB), attributes: f53_att, required: false },

                ]
            })
                .then(data_f0 => {
                    if (!data_f0) return res.send('NO DATA');
                    let f1 = data_f0.fun_1s || {};
                    let f2 = data_f0.fun_2 || {};
                    let f53 = data_f0.fun_53s[0] || {};

                    let cert = {
                        id_public: data_f0.id_public,
                        type: `${f1[0].tipo || ''};${f1[0].tramite || ''};${f1[0].m_urb || ''};${f1[0].m_sub || ''};${f1[0].m_lic || ''}`,
                        state: data_f0.state,
                        date_doc: moment().format('YYYY-MM-DD HH:mm'),

                        name: `${f53.name} ${f53.surname}`.toUpperCase(),
                        id_number: f53.id_number,
                        role: f53.role,

                        address: f2.direccion,
                        address_2: f2.direccion_ant,
                        matricula: f2.matricula,
                        catastral: f2.catastral,
                        catastral_2: f2.catastral_2,
                        city: city,
                        county: county,
                    }

                    cb(cert)

                }).catch(err => res.status(500).send({ message: err.message || "Some error occurred." }));
        }).catch(err => { res.status(500).send({ message: err.message || "Some error occurred." }); });
}