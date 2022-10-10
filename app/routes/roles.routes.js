module.exports = app => {
    const roles = require("../controllers/roles.controller.js");
    const jwt = require('../resources/jwt.module');
    var router = require("express").Router();
  
    // Create a new entry
    router.post("/", jwt.verifyToken, roles.create);
  
    // Retrieve all entries
    router.get("/:dbId&:userId", jwt.verifyToken, roles.findAll);
    router.get("/company/:id_public", jwt.verifyToken, roles.findAllCompany);
    // Retrieve a single entry with id

  
    // Update a entry with id
    router.put("/:id", jwt.verifyToken, roles.update);
  
    // Delete a entry with id
    router.delete("/:id", jwt.verifyToken, roles.delete);

  

  
    app.use('/api/roles', router);
  };