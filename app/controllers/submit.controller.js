const db = require("../models");

const Submit = (db) => db.submit;
const Sub_List = (db) => db.sub_list;
const Sub_Doc = (db) => db.sub_docs;
const FUN_0 = (db) => db.fun_0;

const Op = db.Sequelize.Op;
const moment = require('moment');
const fs = require('fs');
const { getLastVRQuery, validateNewVR, validateLastVR } = require("../resources/sqlQueries");
const { validateDB, getDbData } = require("../resources/jwt.module");
const multerStorageConfig = require("../config/multer.config");;
const { verifyPermit } = require("../resources/permits.controller");
const { dobelaAudit } = require("../resources/audits.controller");
const { download } = require("./files.controller");


// POST
exports.create = (req, res) => {
  verifyPermit(req, 'submit', 2)
    .then(isAllowed => {
      if (!isAllowed) return res.send('NO PERMIT');

      const DB = validateDB(req);

      const id_public = (req.body.id_public ? req.body.id_public : res.send('NOT A REAL ID'));
      const id_related = req.body.id_related ? req.body.id_related : '';
      const object = {
        id_public: id_public,
        id_related: (req.body.id_related ? req.body.id_related : null),
        type: (req.body.type ? req.body.type : null),
        date: (req.body.date ? req.body.date : null),
        time: (req.body.time ? req.body.time : null),
        owner: (req.body.owner ? req.body.owner : null),
        worker_reciever: (req.body.worker_reciever ? req.body.worker_reciever : null),
        worker_id: (req.body.worker_id ? req.body.worker_id : null),
        name_retriever: (req.body.name_retriever ? req.body.name_retriever : null),
        id_number_retriever: (req.body.id_number_retriever ? req.body.id_number_retriever : null),
        details: (req.body.details ? req.body.details : null),
        list_type: (req.body.list_type ? req.body.list_type : null),
        list_type_str: (req.body.list_type_str ? req.body.list_type_str : null),
      };

      let payment = req.body.id_payment;

      const { QueryTypes } = require('sequelize');
      var query = validateNewVR(id_public)

      DB.query(query, { type: QueryTypes.SELECT })
        .then(data => {
          if (data.length) res.send("ERROR_DUPLICATE");
          else nextStep()
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving ALL DATA."
          });
        });

      function nextStep() {
        if (payment) createFUN()
        else createSubmit()
      }


      function createFUN() {
        const { QueryTypes } = require('sequelize');
        var query = `
    SELECT fun_0s.id_public
    FROM fun_0s
    WHERE fun_0s.id_public LIKE '${id_related}'
    `;

        DB.query(query, { type: QueryTypes.SELECT })
          .then(data => {
            if (data.length) res.send("ERROR_DUPLICATE");
            else create_FUN_0()
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving ALL DATA."
            });
          });
      }

      function create_FUN_0() {
        // Create
        var new_fun = {
          version: 1,
          state: 1,
          id_public: (req.body.id_related ? req.body.id_related : null),
          date: (req.body.date ? req.body.date : moment().format('YYYY-MM-DD')),
          id_payment: (req.body.id_payment ? req.body.id_payment : null),
          model: moment().format('YYYY')
        }

        FUN_0(DB).create(new_fun)
          .then(data => {
            createSubmit()
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while executing CREATE."
            });
          });
      }

      function createSubmit() {
        // Create
        Submit(DB).create(object)
          .then(data => {
            dobelaAudit('create - submit', object, DB, req)
            res.send('OK');
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while executing CREATE."
            });
          });
      }


    }).catch(err => res.send('NO PERMIT'));
};
exports.create_list = (req, res) => {
  verifyPermit(req, 'submit', 2)
    .then(isAllowed => {
      if (!isAllowed) return res.send('NO PERMIT');
      const DB = validateDB(req);
      const submitId = (req.body.submitId ? req.body.submitId : res.send('NOT A REAL ID'));

      const object = {
        submitId: submitId,
        list_name: (req.body.list_name ? req.body.list_name : ""),
        list_category: (req.body.list_category ? req.body.list_category : ""),
        list_code: (req.body.list_code ? req.body.list_code : ""),
        list_pages: (req.body.list_pages ? req.body.list_pages : ""),
        list_review: (req.body.list_review ? req.body.list_review : ""),
        list_title: (req.body.list_title ? req.body.list_title : ""),
      };

      // Create
      Sub_List(DB).create(object)
        .then(data => {
          dobelaAudit('create - submit list', object, DB, req)
          res.send('OK');
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while executing CREATE."
          });
        });

    }).catch(err => res.send('NO PERMIT'));
};
exports.create_anex = (req, res) => {
  verifyPermit(req, 'submit', 5)
    .then(isAllowed => {
      if (!isAllowed) return res.send('NO PERMIT');

      const DB = validateDB(req);
      const submitId = (req.body.submitId ? req.body.submitId : res.send('NOT A REAL ID'));
      const files = req.files;

      const filesAccept = "image/png, image/jpeg, image/jpg, application/pdf"
      multerStorageConfig.verify(files, filesAccept);

      const object = {
        submitId: submitId,
        pages: (req.body.pages ? req.body.pages : null),
        id_public: (req.body.id_public ? req.body.id_public : null),
        filename: files[0].filename,
        path: files[0].path.substring(0, files[0].path.lastIndexOf('/'))
      };

      // Create
      Sub_Doc(DB).create(object)
        .then(data => {
          dobelaAudit('create - submit anex', object, DB, req)
          res.send('OK');
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while executing CREATE."
          });
        });

    }).catch(err => res.send('NO PERMIT'));
};

// GET.
exports.findAll = (req, res) => {
  verifyPermit(req, 'submit', 1)
    .then(isAllowed => {
      if (!isAllowed) return res.send('NO PERMIT');

      const DB = validateDB(req);
      Submit(DB).findAll({ include: [Sub_Doc(DB)] })
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

exports.findIdRelated = (req, res) => {
  const DB = validateDB(req);
  const _id_related = req.params.id_related; 7

  const submit_att = ['id_public', 'date', 'time']
  const list_att = ['list_name', 'list_code', 'list_pages', 'list_review']
  //const docs_att = []
  Submit(DB).findAll({
    include: [
      { model: Sub_List(DB), attributes: list_att },
      //{ model: Sub_Doc(DB), attributes: docs_att }
    ],
    where: { id_related: _id_related },
    attributes: submit_att,
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
};

// GET BY ID
exports.findOne = (req, res) => {
  const DB = validateDB(req);
  const id = req.params.id;
  Submit(DB).findByPk(id, { include: [Sub_List(DB), Sub_Doc(DB)] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving DATA with ID=" + id
      });
    });
};


exports.findSearch = (req, res) => {
  const DB = validateDB(req);
  const _field = req.params.field;
  const _string = req.params.string;

  console.log("CONSULT REQUESTED, FOR NOMENCLATURE, FOR FIELD CODE & STRING VALUE: ", _field, _string);

  if (_field == 1) {
    Submit(DB).findAll({
      where: {
        id_public: _string
      },
      include: [Sub_Doc(DB)]
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
  }

  if (_field == 2) {
    Submit(DB).findAll({
      where: {
        id_related: _string
      },
      include: [Sub_Doc]
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
  }

  if (_field == 3) {
    Submit(DB).findAll({
      where: {
        owner: { [Op.like]: `%` + _string + `%` }
      },
      include: [Sub_Doc(DB)]
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
  }

  if (_field == 4) {
    Submit(DB).findAll({
      where: {
        name_retriever: { [Op.like]: `%` + _string + `%` }
      },
      include: [Sub_Doc(DB)]
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
  }

  if (_field == 5) {
    Submit(DB).findAll({
      where: {
        id_number_retriever: { [Op.like]: `%` + _string + `%` }
      },
      include: [Sub_Doc(DB)]
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
  }

};

exports.findLastID = (req, res) => {
  const DB = validateDB(req);
  const { QueryTypes } = require('sequelize');
  var query = getLastVRQuery;

  DB.query(query, { type: QueryTypes.SELECT })
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

exports.verifyRelatedId = (req, res) => {
  const DB = validateDB(req);
  const _id = req.params.id;
  const { QueryTypes } = require('sequelize');
  var query = `
  SELECT fun_0s.id_public AS id_public
  FROM fun_0s
  WHERE fun_0s.id_public LIKE '${_id}'
  
  UNION
  
  SELECT pqrs_masters.id_publico
  FROM pqrs_masters
  WHERE pqrs_masters.id_publico LIKE '${_id}'
  
  UNION
  
  SELECT nomenclatures.id_public 
  FROM nomenclatures
  WHERE nomenclatures.id_public LIKE '${_id}'
  `;

  DB.query(query, { type: QueryTypes.SELECT })
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

// PUT
exports.update = (req, res) => {
  verifyPermit(req, 'submit', 3)
    .then(isAllowed => {
      if (!isAllowed) return res.send('NO PERMIT');

      const DB = validateDB(req);
      const id = req.params.id;

      const new_id = (req.body.new_id);
      const prev_id = (req.body.prev_id);

      if (new_id) {
        req.body.id_public = new_id;

        const { QueryTypes } = require('sequelize');
        var query = validateLastVR(new_id, prev_id)

        DB.query(query, { type: QueryTypes.SELECT })
          .then(data => {
            if (data.length) res.send("ERROR_DUPLICATE");
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving ALL DATA."
            });
          });


      }

      Submit(DB).update(req.body, {
        where: { id: id }
      }).then(num => {
        if (num == 1) {
          dobelaAudit('update - submit', req.body, DB, req)
          res.send('OK');
        } else {
          res.send(`ERROR_2`); // NO MATCHING ID
        }
      })

    }).catch(err => res.send('NO PERMIT'));
};
exports.update_list = (req, res) => {
  verifyPermit(req, 'submit', 3)
    .then(isAllowed => {
      if (!isAllowed) return res.send('NO PERMIT');

      const DB = validateDB(req);
      const id = req.params.id;

      Sub_List(DB).update(req.body, {
        where: { id: id }
      }).then(num => {
        if (num == 1) {
          dobelaAudit('update - submit list', req.body, DB, req)
          res.send('OK');
        } else {
          res.send(`ERROR_2`); // NO MATCHING ID
        }
      })

    }).catch(err => res.send('NO PERMIT'));
};
exports.update_anex = (req, res) => {
  verifyPermit(req, 'submit', 5)
    .then(isAllowed => {
      if (!isAllowed) return res.send('NO PERMIT');

      const DB = validateDB(req);
      const id = req.params.id;
      const files = req.files;

      const object = {
        pages: (req.body.pages ? req.body.pages : null),
        id_public: (req.body.id_public ? req.body.id_public : null),
      };

      if (files.length) {
        const filesAccept = "image/png, image/jpeg, image/jpg, application/pdf"
        multerStorageConfig.verify(files, filesAccept);
        object.filename = files[0].filename;
        object.path = files[0].path.substring(0, files[0].path.lastIndexOf('/'))
      }

      Sub_Doc(DB).update(object, {
        where: { id: id }
      }).then(num => {
        if (num == 1) {
          dobelaAudit('update - submit anex', req.body, DB, req)
          res.send('OK');
        } else {
          res.send(`ERROR_2`); // NO MATCHING ID
        }
      })

    }).catch(err => res.send('NO PERMIT'));
};

// DELETE BY ID
exports.delete = (req, res) => {
  verifyPermit(req, 'submit', 4)
    .then(isAllowed => {
      if (!isAllowed) return res.send('NO PERMIT');

      const DB = validateDB(req);
      const id = req.params.id;
      Submit(DB).destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            dobelaAudit('delete - submit', { id: id }, DB, req)
            res.send('OK');
          } else {
            res.send(`ERROR_2`); // NO MATCHING ID
          }
        })

    }).catch(err => res.send('NO PERMIT'));
};
exports.delete_list = (req, res) => {
  verifyPermit(req, 'submit', 4)
    .then(isAllowed => {
      if (!isAllowed) return res.send('NO PERMIT');

      const DB = validateDB(req);
      const id = req.params.id;
      Sub_List(DB).destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            dobelaAudit('delete - submit list', { id: id }, DB, req)
            res.send('OK');
          } else {
            res.send(`ERROR_2`); // NO MATCHING ID
          }
        })

    }).catch(err => res.send('NO PERMIT'));
};
exports.delete_anex = (req, res) => {
  verifyPermit(req, 'submit', 4)
    .then(isAllowed => {
      if (!isAllowed) return res.send('NO PERMIT');

      const DB = validateDB(req);
      const id = req.params.id;

      Sub_Doc(DB).findOne({
        where: { id: id }
      }).then(data => {
        let name = data.filename;
        let path = data.path;
        let attemptRemove = multerStorageConfig.remove(DB, name, path);
        let object;

        if (attemptRemove) {
          object = { filename: null, path: null };

        }
        else {
          object = { filename: null, path: null };
        }

        Sub_Doc(DB).update(object, {
          where: { id: id }
        }).then(num => {
          if (num == 1) {
            dobelaAudit('delete - submit anex', { id: id }, DB, req)
            res.send('OK');
          } else {
            res.send(`ERROR_2`); // NO MATCHING ID
          }
        })

      })

    }).catch(err => res.send('NO PERMIT'));
};

// DELETE ALL
exports.deleteAll = (req, res) => {
  res.json({ message: "NOT IMPLEMENTED" });
};



exports.gendoc_submit = (req, res) => {
  verifyPermit(req, 'submit', 6)
    .then(isAllowed => {
      if (!isAllowed) return res.send('NO PERMIT');

      const DB = validateDB(req);
      var _DATA = {
        id: (req.body.id != 'null' ? req.body.id : ""),
      }

      Submit(DB).findByPk(_DATA.id, { include: [Sub_List(DB), Sub_Doc(DB)] })
        .then(data => {
          const path = '/docs/public/output_submit.pdf';
          data.path = path;
          data.lang = req.body.lang ? req.body.lang : "en";
          const fileName = 'vrdoc.pdf'
          _PDFGEN_NOMENCLATURE(data, DB);
          setTimeout(() => download(res, path, fileName), 1000)
        })
        .catch(err => {
          res.status(500).send({
            message: err
          });
        });
    }).catch(err => res.send('NO PERMIT'));
};


function _PDFGEN_NOMENCLATURE(_DATA, DB) {
  const PDFDocument = require('pdfkit');
  const pdfSupport = require("../resources/pdf.lib.js");

  getDbData(db.DBS['Database0'], DB.name).then(curaduriaInfo => _continue_(curaduriaInfo.companyInfo));

  function _continue_(curaduriaInfo) {
    var doc = new PDFDocument({
      size: 'LETTER', margins: {
        top: 120,
        bottom: 56,
        left: 56,
        right: 56
      },
      bufferPages: true,
    });
    const lang = _DATA.lang
    const trn = {
      en: {
        title: 'CONTROL OF ENTRY DOCUMENTS',
        Hd: ['ITEM ID:', 'PROCESS ID', 'MODE', 'ENTRY DATE', 'PROPRIETARY'],
        Cl: ['CODE', '# PAGES / BLUEPRINTS', 'DETAILS'],
        Fo: ['RECEIVING WORKER', 'PROVIDING PERSON', 'DOCUMENT ID', 'SIGNATURE'],
      },
      es: {
        title: 'CONTROL DE INGRESO DOCUMENTAL',
        Hd: ['CONSECUTIVO RADICACIÓN:', 'SOLICITUD N°:', 'TIPO DE ACTUACIÓN:', 'FECHA INGRESO:', 'PROPIETARIO(S):'],
        Cl: ['CÓDIGO', '# DE FOLIOS / PLANOS ', 'DETALLES'],
        Fo: ['FUNCIONARIO QUE RECIBE:', 'PERSONA QUE ENTREGA', 'DOCUMENTO DE IDENTIFICACIÓN:', 'FIRMA'],
      }
    }


    doc.pipe(fs.createWriteStream('.' + _DATA.path));

    doc.startPage = doc.bufferedPageRange().count - 1;
    doc.lastPage = doc.bufferedPageRange().count - 1;
    doc.on('pageAdded', () => { doc.startPage++; doc.lastPage++ });

    doc.fontSize(10);
    doc.moveDown();
    pdfSupport.table(doc,
      [
        { coord: [0, 0], w: 20, h: 1, text: trn[lang].Hd[0], config: { align: 'left', } },
        { coord: [20, 0], w: 40, h: 1, text: _DATA.id_public, config: { align: 'left', bold: true } },

        { coord: [0, 1], w: 20, h: 1, text: trn[lang].Hd[1], config: { align: 'left', } },
        { coord: [20, 1], w: 40, h: 1, text: _DATA.id_related, config: { align: 'left', bold: true } },

        { coord: [0, 2], w: 20, h: 1, text: trn[lang].Hd[2], config: { align: 'left', } },
        { coord: [20, 2], w: 40, h: 1, text: _DATA.type, config: { align: 'left', bold: true } },

        { coord: [0, 3], w: 20, h: 1, text: trn[lang].Hd[3], config: { align: 'left', } },
        { coord: [20, 3], w: 40, h: 1, text: `${_DATA.date || ''} ${_DATA.time ? _DATA.time : ""}`, config: { align: 'left', bold: true } },

        { coord: [0, 4], w: 20, h: 1, text: trn[lang].Hd[4], config: { align: 'left', } },
        { coord: [20, 4], w: 40, h: 1, text: `${_DATA.owner || ''}`, config: { align: 'left', bold: true } },

      ],
      [doc.x, doc.y], [60, 5], { lineHeight: -1 })

    var _LIST = _DATA.sub_lists;
    doc.fontSize(8);
    doc.moveDown();
    for (var i = 0; i < _LIST.length; i++) {
      pdfSupport.table(doc,
        [
          { coord: [0, 0], w: 8, h: 1, text: trn[lang].Cl[0], config: { align: 'center', bold: true, fill: 'gainsboro', valign: true, } },

          { coord: [8, 0], w: 44, h: 1, text: _LIST[i].list_title, config: { align: 'center', bold: true, fill: 'gainsboro', valign: true, } },

          { coord: [52, 0], w: 8, h: 1, text: trn[lang].Cl[1], config: { align: 'center', bold: true, fill: 'gainsboro', valign: true, } },

        ],
        [doc.x, doc.y], [60, 1], { lineHeight: -1 })

      let name = _LIST[i].list_name.split(";")
      //let category = _LIST[i].list_category.split(",")
      let code = _LIST[i].list_code.split(",")
      let page = _LIST[i].list_pages.split(",")
      let review = _LIST[i].list_review.split(",")

      let items = name.length;
      for (var j = 0; j < items; j++) {
        if (review[j] == "SI") pdfSupport.table(doc,
          [
            { coord: [0, 0], w: 8, h: 1, text: code[j], config: { align: 'center', } },

            { coord: [8, 0], w: 44, h: 1, text: name[j], config: { align: 'left', } },

            { coord: [52, 0], w: 8, h: 1, text: page[j], config: { align: 'center', } },

          ],
          [doc.x, doc.y], [60, 1], { lineHeight: -1 })
      }
    }
    doc.moveDown();

    pdfSupport.table(doc,
      [
        { coord: [0, 0], w: 60, h: 1, text: trn[lang].Cl[2], config: { align: 'center', bold: true, fill: 'gainsboro' } },
        { coord: [0, 1], w: 60, h: 1, text: String(_DATA.details || ''), config: { align: 'justify', } },

      ],
      [doc.x, doc.y], [60, 2], { lineHeight: -1 })

    doc.moveDown();

    pdfSupport.table(doc,
      [
        { coord: [0, 0], w: 20, h: 1, text: trn[lang].Fo[0], config: { align: 'left', } },
        { coord: [20, 0], w: 20, h: 1, text: String(_DATA.worker_reciever || '').toUpperCase(), config: { align: 'left', bold: true } },

        { coord: [0, 1], w: 20, h: 1, text: trn[lang].Fo[1], config: { align: 'left', } },
        { coord: [20, 1], w: 20, h: 1, text: String(_DATA.name_retriever || '').toUpperCase(), config: { align: 'left', bold: true } },

        { coord: [0, 2], w: 20, h: 1, text: trn[lang].Fo[2], config: { align: 'left', } },
        { coord: [20, 2], w: 20, h: 1, text: _DATA.id_number_retriever || '', config: { align: 'left', bold: true } },

        { coord: [40, 0], w: 20, h: 3, text: trn[lang].Fo[3], config: { align: 'center', valign: 'bot' } },

      ],
      [doc.x, doc.y], [60, 3], {})


    pdfSupport.setHeader(doc, { title: trn[lang].title, id_public: _DATA.id_public, icon: true }, curaduriaInfo)
    pdfSupport.setBottom(doc, false, true, false, curaduriaInfo)


    doc.end();
    return;
  }
}