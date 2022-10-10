
module.exports = app => {
    const FUN = require("../controllers/fun.controller");
    const jwt = require('../resources/jwt.module');
    var router = require("express").Router();

    // LOG INTO THE APP
    router.get("/", jwt.verifyToken, FUN.findAll);

    router.post("/", jwt.verifyToken, FUN.create);
    
    router.get("/:dateStart&:dateEnd", jwt.verifyToken, FUN.findAll);
    router.get("/:id", jwt.verifyToken, FUN.getGeneral);
    router.get("/get/idpublic/:id_public",jwt.verifyToken, FUN.findOneIdPublic);
    router.get("/getlast/id", jwt.verifyToken, FUN.getLastIdPublic);
    router.get("/fun6d/:id", jwt.verifyToken, FUN.loadFun6Doc);

    app.use('/api/fun', router);
  };