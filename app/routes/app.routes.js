module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const jwt = require('../resources/jwt.module');
    const nots = require('../resources/notificacions.controller.js');
    var router = require("express").Router();

    // LOG INTO THE APP
    router.post("/login", users.appLogin);
    router.post("/signup", users.appSignUp);
    router.get("/verify", users.verifyLogin);

    // ACCOUNT AVTIATION
    router.post("/accountverify", users.appVerifyAccount);
    router.post("/accountverifyemail", users.appVerifyAccountEmailReminder);

    // USER INVITATION
    router.post("/invitation", jwt.verifyTokenUser, users.setInvitationCursEmail);
    router.post("/accountaccept", users.accetpInvitationCurs);

    // PASSWORD RESET
    router.post("/reset", users.appResetPassEmail);
    router.post("/resetpass", users.appResetPassConfirm);
    router.get("/resetverify", users.verifyJWT);

    router.get("/companies/:idUser", jwt.verifyTokenUser, users.loadCompanies);
    router.post("/companies/save/", jwt.verifyTokenUser, users.saveCompany);
    router.get("/workers/:dbIndex", jwt.verifyToken, users.loadWorkers);
    router.get("/workerdata/:dbIndex&:idUser", jwt.verifyToken, users.loadWorkerData);

  // USER NOTIFICACIONS
    router.get("/notifications/:email", nots.findAll);
    router.post("/notifications/mark", nots.markNotifications);

    // PROFESIONAL ROUTES
    router.post("/profesionals", jwt.verifyTokenUser, users.update_profesional);

    app.use('/api', router);
  };