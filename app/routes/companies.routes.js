module.exports = app => {
    const company = require("../controllers/company.controller.js");
    const jwt = require('../resources/jwt.module');
    const audits = require('../resources/audits.controller.js');
    var router = require("express").Router();

     // AUDITS
     router.get("/audit/team/", jwt.verifyTokenUser, audits.findAllTeam);
     router.get("/audit/app", jwt.verifyTokenUser, audits.findAllApp);

    // DICTIOARY QUERIES
    router.get("/dict/lic/", jwt.verifyToken, company.get_lic);
    router.get("/dict/oa/", jwt.verifyToken, company.get_oa);
    router.get("/dict/in/", jwt.verifyToken, company.get_in);
    router.get("/dict/out/", jwt.verifyToken, company.get_out);
    router.get("/dict/res/", jwt.verifyToken, company.get_res);
    router.get("/dict/cert/", jwt.verifyToken, company.get_cert);
    router.get("/dict/tit/", jwt.verifyToken, company.get_tit);
    router.get("/dict/prof/", jwt.verifyToken, company.get_prof);
    router.get("/dict/prev/", jwt.verifyToken, company.get_prev);

    // OTHERS
    router.post("/calc/tc", jwt.verifyTokenUser, company.taxCalculation); // GENERATES PDF OF TAX CALCULATION 

    router.get("/img/logo/", company.get_logo); // GET LOGO IMG OF THE TEAM
    router.get("/img/sign/", company.get_sign); // GET SIGNATURE IMG OF THE TEAM

    router.post("/img/logo", jwt.verifyToken, company.set_logo);  // SETS LOGO IMG OF THE TEAM
    router.post("/img/sign", jwt.verifyToken, company.set_sign); // SETS SIGNATURE IMG OF THE TEAM

    app.use('/api', router);
  };