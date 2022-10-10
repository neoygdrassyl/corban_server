module.exports = app => {
    const templates = require("../controllers/templates.controller.js");
    const jwt = require('../resources/jwt.module');
    var router = require("express").Router();
  
    // Create 
    router.post("/", jwt.verifyToken, templates.create);
  
    // Retrieve all
    router.get("/", jwt.verifyToken, templates.findAll);
    router.get("/:type", jwt.verifyToken, templates.findAllByType);

    // Update 
    router.put("/:id", jwt.verifyToken, templates.update);
  
    // Delete
    router.delete("/:id", jwt.verifyToken, templates.delete);

    app.use('/api/templates', router);
  };