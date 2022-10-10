module.exports = app => {
    const certs = require("../controllers/certifications.controller.js");
    const jwt = require('../resources/jwt.module');
    var router = require("express").Router();
  
    // Create
    router.post("/", jwt.verifyTokenUser, certs.create);
    
    // Retrieve
    router.get("/", jwt.verifyTokenUser, certs.findAll);
    router.get("/id/:id", jwt.verifyTokenUser, certs.findOne);
    router.get("/oc/:oc", jwt.verifyTokenUser, certs.findOneOc);
    router.get("/idr/:idr", jwt.verifyTokenUser, certs.findAllRelated );

    router.get("/prof/:id", jwt.verifyTokenUser, certs.findProf);
    router.get("/fun/:id", jwt.verifyTokenUser, certs.findFun);

    router.get("/data/fun/:id_public", jwt.verifyTokenUser, certs.findDataFun);
    router.get("/data/profs/:name", jwt.verifyTokenUser, certs.findDataProfs);
    router.get("/data/prof/:id_number", jwt.verifyTokenUser, certs.findDataProf);
    // PDF
    router.post("/pdf", jwt.verifyTokenUser, certs.genPDF );

    app.use('/api/certs', router);
  };