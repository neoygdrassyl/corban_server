module.exports = app => {
    const workers = require("../controllers/workers.controller.js");
    const jwt = require('../resources/jwt.module');
    var router = require("express").Router();
  
    // Create a new entry
    router.post("/", jwt.verifyToken, workers.create);
  
    // Retrieve all entries
    router.get("/:id_public", jwt.verifyToken, workers.findAll);
  
    // Retrieve a single entry with id

  
    // Update a entry with id
    router.put("/:id", jwt.verifyToken, workers.update);
    router.put("/activate/:id", jwt.verifyToken, workers.activate);
  
    // Delete a entry with id
    router.delete("/:id", jwt.verifyToken, workers.delete);

  

  
    app.use('/api/workersc', router);
  };