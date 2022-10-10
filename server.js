require('dotenv').config()

global.__doveleVersion = '0.5.0' 
global.__frontDir = process.env.MODE == 'dev' ? 'http://localhost:3000' : process.env.FRONT_URL;
global.__basedir = __dirname;
global.__docsdir = "/home/curaduri/apps_docs/corban/";
global.__profdir = "/home/curaduri/apps_docs/profesionals/";

const multerStorageConfig = require("./app/config/multer.config");

const express = require('express')
const cors = require('cors')
const app = express();
const multer = require('multer')
const upload = multer({ storage: multerStorageConfig.store() })
app.use(cors({exposedHeaders: 'content-jwt'}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//  Allow form-data parsing
app.use(upload.any());

const db = require("./app/models");
db.DBS['Database0'].sync({ alter: true }); // DB FOR COMPANIES AND USERS
//db.DBS['DatabaseT'].sync({ alter: false }); // DB FOR TESTING
console.log("DONE!");

const databases = Object.keys(db.DBS);
/* 
for (let i = 0; i < databases.length; ++i) {

db.DBS[databases[i]].sync();
console.log('SYNC DB: ' + databases[i])
console.log("DONE!");

db.DBS[databases[i]].sync({ alter: true }).then(() => {
console.log('SYNC & UPDATE DB: '+databases[i])
console.log("DONE!");
});


}
*/
app.get('/', (req, res) => {
  res.json({ message: "Connection to Server CORBAN OK!", vars: { __basedir, __docsdir, __frontDir, __profdir } });
});



// Ruotes
require("./app/routes/app.routes")(app);
require("./app/routes/companies.routes")(app);
require("./app/routes/roles.routes")(app);
require("./app/routes/workers.routes")(app);
require("./app/routes/bugs.routes")(app);
require("./app/routes/templates.routes")(app);

require("./app/routes/file.routes")(app);
require("./app/routes/certifications.routes")(app);
require("./app/routes/fun.routes")(app);
require("./app/routes/submit.routes")(app);

// FOR DEV

const PORT = process.env.PORT || 3002;
const IP_ADRESS = process.env.IP_ADRESS || '127.0.0.1';

// FOR VPS TESTING
app.listen(PORT, () => {
  console.log(`Server CORBAN is running on port ${PORT}.`);
});