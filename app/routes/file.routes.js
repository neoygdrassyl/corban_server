module.exports = app => {

  const files = require("../controllers/files.controller.js");
  const jwt = require('../resources/jwt.module');

  var router = require("express").Router();
  // THIS IS THE API FOR DOWNLOADING PDFS AND IMAGES SAVED INTO THE SYSTEM
  router.get("/document/:dbIndex/:homePath/:year/:folder/:filename", files.donwloadDocument);


  app.use('/api', router);
};