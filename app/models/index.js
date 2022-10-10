const fs = require('fs');
//const path = require('path');
const Sequelize = require('sequelize');
//const basename = path.basename(module.filename);
const config = require(`../config/databases.config`);

//Create an empty object which can store our databases
const db = {};
db.DBS = {};
db.Sequelize = Sequelize;


// DATA BASE 0 - MAIN CORBAN DATABASE


const dbUsers = config.users.databases.Database0;
db.DBS['Database0'] = new Sequelize(dbUsers.database, dbUsers.username, dbUsers.password, dbUsers);

db.DBS.Database0.audits = require("./database0/audits.model.js")(db.DBS.Database0, Sequelize);
db.DBS.Database0.bugs = require("./database0/bugs.model.js")(db.DBS.Database0, Sequelize);

db.DBS.Database0.accounts = require("./database0/sessions.model.js")(db.DBS.Database0, Sequelize);
db.DBS.Database0.companies = require("./database0/companies.model.js")(db.DBS.Database0, Sequelize);
db.DBS.Database0.logins = require("./database0/logins.model.js")(db.DBS.Database0, Sequelize);
db.DBS.Database0.notifications = require("./database0/notifications.model.js")(db.DBS.Database0, Sequelize);
db.DBS.Database0.roles = require("./database0/roles.model.js")(db.DBS.Database0, Sequelize);
db.DBS.Database0.sessions = require("./database0/sessions.model.js")(db.DBS.Database0, Sequelize);
db.DBS.Database0.users = require("./database0/users.model.js")(db.DBS.Database0, Sequelize);
db.DBS.Database0.workers = require("./database0/worker.model.js")(db.DBS.Database0, Sequelize);
db.DBS.Database0.mailers = require("./database0/mailers.model.js")(db.DBS.Database0, Sequelize);

db.DBS.Database0.roles_workers = require("./database0/roles_workers.model.js")(db.DBS.Database0, Sequelize);

// RELATIONS
db.DBS.Database0.companies.hasOne(db.DBS.Database0.accounts);
db.DBS.Database0.accounts.belongsTo(db.DBS.Database0.companies);

db.DBS.Database0.users.hasOne(db.DBS.Database0.logins);
db.DBS.Database0.logins.belongsTo(db.DBS.Database0.users);

db.DBS.Database0.users.hasMany(db.DBS.Database0.notifications);
db.DBS.Database0.notifications.belongsTo(db.DBS.Database0.users);

db.DBS.Database0.users.hasMany(db.DBS.Database0.sessions);
db.DBS.Database0.sessions.belongsTo(db.DBS.Database0.users);

db.DBS.Database0.users.hasMany(db.DBS.Database0.workers);
db.DBS.Database0.workers.belongsTo(db.DBS.Database0.users);

db.DBS.Database0.companies.hasMany(db.DBS.Database0.workers);
db.DBS.Database0.workers.belongsTo(db.DBS.Database0.companies);

db.DBS.Database0.companies.hasMany(db.DBS.Database0.mailers);
db.DBS.Database0.mailers.belongsTo(db.DBS.Database0.companies);

db.DBS.Database0.companies.hasMany(db.DBS.Database0.roles);
db.DBS.Database0.roles.belongsTo(db.DBS.Database0.companies);

db.DBS.Database0.roles.hasMany(db.DBS.Database0.roles_workers);
db.DBS.Database0.workers.hasMany(db.DBS.Database0.roles_workers);
db.DBS.Database0.roles_workers.belongsTo(db.DBS.Database0.roles);
db.DBS.Database0.roles_workers.belongsTo(db.DBS.Database0.workers);

// DATABSES X - DATA BASES FOR THE TEAMS
const databases = config.databases;
for (let i = 0; i < databases.length; ++i) {
  let database = databases[i].name;
  let dbPath = databases[i];
  db.DBS[database] = new Sequelize(dbPath.database, dbPath.username, dbPath.password, dbPath);
  db.DBS[database].name = database;
  // MODELS
  db.DBS[database].audits = require("./databaseX/audits.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].templates = require("./databaseX/templates.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].certification = require("./databaseX/certification.model.js")(db.DBS[database], Sequelize);

  db.DBS[database].fun_0 = require("./databaseX/fun/fun_0.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_1 = require("./databaseX/fun/fun_1.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_2 = require("./databaseX/fun/fun_2.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_3 = require("./databaseX/fun/fun_3.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_4 = require("./databaseX/fun/fun_4.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_51 = require("./databaseX/fun/fun_51.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_52 = require("./databaseX/fun/fun_52.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_53 = require("./databaseX/fun/fun_53.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_6 = require("./databaseX/fun/fun_6.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_6_h = require("./databaseX/fun/fun_6_h.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_c = require("./databaseX/fun/fun_c.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_r = require("./databaseX/fun/fun_r.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_law = require("./databaseX/fun/fun_law.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_clock = require("./databaseX/fun/fun_clock.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_archive = require("./databaseX/fun/fun_archive.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].seals = require("./databaseX/fun/seal.models.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_law = require("./databaseX/fun/fun_law.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].fun_archive = require("./databaseX/fun/fun_archive.model.js")(db.DBS[database], Sequelize);
  // FUN RELATIONS
  db.DBS[database].fun_0.hasMany(db.DBS[database].fun_1);
  db.DBS[database].fun_1.belongsTo(db.DBS[database].fun_0);
  db.DBS[database].fun_0.hasMany(db.DBS[database].fun_51);
  db.DBS[database].fun_51.belongsTo(db.DBS[database].fun_0);
  db.DBS[database].fun_0.hasMany(db.DBS[database].fun_52);
  db.DBS[database].fun_52.belongsTo(db.DBS[database].fun_0);
  db.DBS[database].fun_0.hasMany(db.DBS[database].fun_53);
  db.DBS[database].fun_53.belongsTo(db.DBS[database].fun_0);
  db.DBS[database].fun_0.hasMany(db.DBS[database].fun_6);
  db.DBS[database].fun_6.belongsTo(db.DBS[database].fun_0);
  db.DBS[database].fun_6.hasMany(db.DBS[database].fun_6_h);
  db.DBS[database].fun_6_h.belongsTo(db.DBS[database].fun_6);
  db.DBS[database].fun_0.hasMany(db.DBS[database].fun_3);
  db.DBS[database].fun_3.belongsTo(db.DBS[database].fun_0);
  db.DBS[database].fun_0.hasMany(db.DBS[database].fun_4);
  db.DBS[database].fun_4.belongsTo(db.DBS[database].fun_0);
  // CHECK LIST INFO
  db.DBS[database].fun_0.hasMany(db.DBS[database].fun_c);
  db.DBS[database].fun_c.belongsTo(db.DBS[database].fun_0);
  // CHECK LIST DOCUMENTOS
  db.DBS[database].fun_0.hasMany(db.DBS[database].fun_r);
  db.DBS[database].fun_r.belongsTo(db.DBS[database].fun_0);
  // CLOCK
  db.DBS[database].fun_0.hasMany(db.DBS[database].fun_clock);
  db.DBS[database].fun_clock.belongsTo(db.DBS[database].fun_0);
  // ONE TO ONE -> FUN!
  db.DBS[database].fun_0.hasOne(db.DBS[database].fun_2);
  db.DBS[database].fun_2.belongsTo(db.DBS[database].fun_0);
  // TIME CONSTROL
  db.DBS[database].fun_0.hasOne(db.DBS[database].fun_law);
  db.DBS[database].fun_law.belongsTo(db.DBS[database].fun_0);
  db.DBS[database].fun_0.hasOne(db.DBS[database].fun_archive);
  db.DBS[database].fun_archive.belongsTo(db.DBS[database].fun_0);
  // ONE TO ONE -> FUN -> SEALS
  db.DBS[database].fun_0.hasOne(db.DBS[database].seals);
  db.DBS[database].seals.belongsTo(db.DBS[database].fun_0);


  // RECORDS LAW
  db.DBS[database].record_law = require("./databaseX/records/record_law/record_law.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_law_licence = require("./databaseX/records/record_law/record_law_licence.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_law_11_liberty = require("./databaseX/records/record_law/record_law_11_liberty.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_law_11_tax = require("./databaseX/records/record_law/record_law_11_tax.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_law_step = require("./databaseX/records/record_law/record_law_step.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_law_review = require("./databaseX/records/record_law/record_law_review.model.js")(db.DBS[database], Sequelize);
  // RECORDS LAW RELATIONS
  db.DBS[database].fun_0.hasOne(db.DBS[database].record_law);
  db.DBS[database].record_law.belongsTo(db.DBS[database].fun_0);
  // ONE TO MANY 
  db.DBS[database].record_law.hasMany(db.DBS[database].record_law_review);
  db.DBS[database].record_law_review.belongsTo(db.DBS[database].record_law);
  db.DBS[database].record_law.hasMany(db.DBS[database].record_law_licence);
  db.DBS[database].record_law_licence.belongsTo(db.DBS[database].record_law);
  db.DBS[database].record_law.hasMany(db.DBS[database].record_law_11_liberty);
  db.DBS[database].record_law_11_liberty.belongsTo(db.DBS[database].record_law);
  db.DBS[database].record_law.hasMany(db.DBS[database].record_law_11_tax);
  db.DBS[database].record_law_11_tax.belongsTo(db.DBS[database].record_law);
  db.DBS[database].record_law.hasMany(db.DBS[database].record_law_step);
  db.DBS[database].record_law_step.belongsTo(db.DBS[database].record_law);


  // RECORDS ENG
  db.DBS[database].record_eng = require("./databaseX/records/record_eng/record_eng.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_eng_step = require("./databaseX/records/record_eng/record_eng_step.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_eng_sismic = require("./databaseX/records/record_eng/record_eng_sismic.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_eng_review = require("./databaseX/records/record_eng/record_eng_review.model.js")(db.DBS[database], Sequelize);
  // RECORDS ENG RELATIONS
  db.DBS[database].fun_0.hasOne(db.DBS[database].record_eng);
  db.DBS[database].record_eng.belongsTo(db.DBS[database].fun_0);
  // ONE TO MANY
  db.DBS[database].record_eng.hasMany(db.DBS[database].record_eng_step);
  db.DBS[database].record_eng_step.belongsTo(db.DBS[database].record_eng);
  db.DBS[database].record_eng.hasMany(db.DBS[database].record_eng_sismic);
  db.DBS[database].record_eng_sismic.belongsTo(db.DBS[database].record_eng);
  db.DBS[database].record_eng.hasMany(db.DBS[database].record_eng_review);
  db.DBS[database].record_eng_review.belongsTo(db.DBS[database].record_eng);


  // RECORDS ARCHITECTURE
  db.DBS[database].record_arc = require("./databaseX/records/record_arc/record_arc.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_arc_38 = require("./databaseX/records/record_arc/record_arc_38.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_arc_33_area = require("./databaseX/records/record_arc/record_arc_33_area.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_arc_34_gens = require("./databaseX/records/record_arc/record_arc_34_gen.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_arc_34_k = require("./databaseX/records/record_arc/record_arc_34_k.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_arc_35_parking = require("./databaseX/records/record_arc/record_arc_35_parking.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_arc_35_location = require("./databaseX/records/record_arc/record_arc_35_location.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_arc_step = require("./databaseX/records/record_arc/record_arc_step.model.js")(db.DBS[database], Sequelize);
  // RECORDS ARCHITECTURE RELATIONS
  db.DBS[database].fun_0.hasOne(db.DBS[database].record_arc);
  db.DBS[database].record_arc.belongsTo(db.DBS[database].fun_0);
  // ONE TO MANY 
  db.DBS[database].record_arc.hasMany(db.DBS[database].record_arc_38);
  db.DBS[database].record_arc_38.belongsTo(db.DBS[database].record_arc);
  db.DBS[database].record_arc.hasMany(db.DBS[database].record_arc_33_area);
  db.DBS[database].record_arc_33_area.belongsTo(db.DBS[database].record_arc);
  db.DBS[database].record_arc.hasMany(db.DBS[database].record_arc_35_parking);
  db.DBS[database].record_arc_35_parking.belongsTo(db.DBS[database].record_arc);
  db.DBS[database].record_arc.hasMany(db.DBS[database].record_arc_35_location);
  db.DBS[database].record_arc_35_location.belongsTo(db.DBS[database].record_arc);
  db.DBS[database].record_arc.hasMany(db.DBS[database].record_arc_34_gens);
  db.DBS[database].record_arc_34_gens.belongsTo(db.DBS[database].record_arc);
  db.DBS[database].record_arc.hasMany(db.DBS[database].record_arc_34_k);
  db.DBS[database].record_arc_34_k.belongsTo(db.DBS[database].record_arc_34_k);
  db.DBS[database].record_arc.hasMany(db.DBS[database].record_arc_step);
  db.DBS[database].record_arc_step.belongsTo(db.DBS[database].record_arc);

  // RECORDS PH
  db.DBS[database].record_ph = require("./databaseX/records/record_ph/record_ph.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_ph_blueprint = require("./databaseX/records/record_ph/record_ph_blueprint.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_ph_floor = require("./databaseX/records/record_ph/record_ph_floor.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].record_ph_building = require("./databaseX/records/record_ph/record_ph_building.model.js")(db.DBS[database], Sequelize);
  // RECORDS PH RELATIONS
  db.DBS[database].fun_0.hasOne(db.DBS[database].record_ph);
  db.DBS[database].record_ph.belongsTo(db.DBS[database].fun_0);
  db.DBS[database].record_ph.hasMany(db.DBS[database].record_ph_blueprint);
  db.DBS[database].record_ph_blueprint.belongsTo(db.DBS[database].record_ph);
  db.DBS[database].record_ph.hasMany(db.DBS[database].record_ph_floor);
  db.DBS[database].record_ph_floor.belongsTo(db.DBS[database].record_ph);
  db.DBS[database].record_ph.hasMany(db.DBS[database].record_ph_building);
  db.DBS[database].record_ph_building.belongsTo(db.DBS[database].record_ph);

  // RECORD REVIEW
  db.DBS[database].record_review = require("./databaseX/records/record_review.model.js")(db.DBS[database], Sequelize);
  // RECORD REVIEW RELATIONS
  db.DBS[database].fun_0.hasOne(db.DBS[database].record_review);
  db.DBS[database].record_review.belongsTo(db.DBS[database].fun_0);

  // EXPEDITIONS
  db.DBS[database].expedition = require("./databaseX/expedition/expedition.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].exp_area = require("./databaseX/expedition/exp_area.model.js")(db.DBS[database], Sequelize);
  // EXPEDITIONS RELATIONS
  db.DBS[database].fun_0.hasOne(db.DBS[database].expedition);
  db.DBS[database].expedition.belongsTo(db.DBS[database].fun_0);
  db.DBS[database].expedition.hasMany(db.DBS[database].exp_area);
  db.DBS[database].exp_area.belongsTo(db.DBS[database].expedition);

  // SUBMIT
  db.DBS[database].submit = require("./databaseX/submit/submit.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].sub_list = require("./databaseX/submit/sub_list.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].sub_docs = require("./databaseX/submit/submit_doc.model.js")(db.DBS[database], Sequelize);
  // SUBMIT RELATIONS
  db.DBS[database].submit.hasMany(db.DBS[database].sub_list);
  db.DBS[database].sub_list.belongsTo(db.DBS[database].submit);
  db.DBS[database].submit.hasOne(db.DBS[database].sub_docs);
  db.DBS[database].sub_docs.belongsTo(db.DBS[database].submit);

  // NOMENCLATURES
  db.DBS[database].nomenclature = require("./databaseX/nomenclature/nomenclature.model.js")(db.DBS[database], Sequelize);
  db.DBS[database].nomen_docs = require("./databaseX/nomenclature/nomedocs.model.js")(db.DBS[database], Sequelize);
  // NOMENCLATURRES RELATIONS
  db.DBS[database].nomenclature.hasOne(db.DBS[database].nomen_docs);
  db.DBS[database].nomen_docs.belongsTo(db.DBS[database].nomenclature);
}

module.exports = db;
