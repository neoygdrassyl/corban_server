module.exports = app => {
    const bugs = require("../controllers/bugs.controller.js");
    const jwt = require('../resources/jwt.module');
    var router = require("express").Router();
  
    // Create
    router.post("/", jwt.verifyTokenUser, bugs.create);
    // Retrieve all
    router.get("/:dbId&:userId", jwt.verifyTokenUser, bugs.findAll);
    // Update
    router.put("/:id", jwt.verifyTokenUser, bugs.update);
    // Delete
    router.delete("/:id", jwt.verifyTokenUser, bugs.delete);

    app.use('/api/bugs', router);
  };