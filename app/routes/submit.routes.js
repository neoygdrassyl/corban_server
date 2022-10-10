module.exports = app => {
  const submit = require("../controllers/submit.controller.js");
  const jwt = require('../resources/jwt.module');
  var router = require("express").Router();

  // Create a new entry
  router.post("/", jwt.verifyToken, submit.create);
  router.post("/create_list", jwt.verifyToken, submit.create_list);
  router.post("/anex", jwt.verifyToken, submit.create_anex);

  // Retrieve all entries
  router.get("/", jwt.verifyToken, submit.findAll);

  // Retrieve a single entry with id
  router.get("/:id", jwt.verifyToken, submit.findOne);
  router.get("/getsearch/:field&:string", jwt.verifyToken, submit.findSearch);
  router.get("/getid/lastid", jwt.verifyToken, submit.findLastID);
  router.get("/getid/verifyid/:id", jwt.verifyToken, submit.verifyRelatedId);
  router.get("/getlist/:id_related", jwt.verifyToken, submit.findIdRelated);

  // Update a entry with id
  router.put("/:id", jwt.verifyToken, submit.update);
  router.put("/update_list/:id", jwt.verifyToken, submit.update_list);
  router.put("/anex/:id", jwt.verifyToken, submit.update_anex);

  // Delete a entry with id
  router.delete("/:id", jwt.verifyToken, submit.delete);
  router.delete("/delete_list/:id", jwt.verifyToken, submit.delete_list);
  router.delete("/delete_anex/:id", jwt.verifyToken, submit.delete_anex);
  // Delete all entry
  router.delete("/", submit.deleteAll);

  // PDF GEN
  router.post("/gendoc/submit", submit.gendoc_submit);

  app.use('/api/submit', router);
};