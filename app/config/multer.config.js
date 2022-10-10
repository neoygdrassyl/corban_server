const multer = require('multer');
const fs = require('fs');
const { validateDB } = require('../resources/jwt.module');

const ALLOWED_PATHS = ['pqrs', 'process', 'publish', 'nomenclature', 'submit'];
const DIR_DEFAULT = 'unsorted';

// WHEN A FILE IS UPLOADED, THIS COFIG IS GOING TO VALIDATE THEM AND SAVE THEM IN A GIVE SPACE IN THE SERVER IN THE FOLDER /apps_docs

exports.store = () => {
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const DB = validateDB(req);
    
      const _ORGPATH = __docsdir + "/" + DB.name + "/";
      const _APP = req.headers['app'];

      var DIR_TARGET = DIR_DEFAULT;
      var DIR = '';
      if (_APP == 'logo' || _APP == 'sign' ) DIR = _ORGPATH;

      if (_APP == 'dovela') {
        
        const _fileInfo = file.originalname.split('_');
        const _HOMEPATH = _fileInfo[0]
        const _CURRENTYEAR = _fileInfo[1]
        const _HOMEFOLDER = _fileInfo[2]


        // VALIDATON FOR UPLOADING FILES
        if (ALLOWED_PATHS.includes(_HOMEPATH)) DIR_TARGET = _HOMEPATH
        else DIR_TARGET = DIR_DEFAULT;

        console.log("Checking dirs if extist: ", _ORGPATH, DIR_TARGET, _CURRENTYEAR, _HOMEFOLDER)

        if (!fs.existsSync(_ORGPATH)) {
          console.log(_ORGPATH, "Does not exist, creating...")
          fs.mkdirSync(_ORGPATH);
        }

        DIR = _ORGPATH + "/" + DIR_TARGET;
        if (!fs.existsSync(DIR)) {
          console.log(DIR_TARGET, "Does not exist, creating...")
          fs.mkdirSync(DIR);
        }

        DIR = DIR + "/" + _CURRENTYEAR
        if (!fs.existsSync(DIR)) {
          console.log(_CURRENTYEAR, "Does not exist, creating...")
          fs.mkdirSync(DIR);
        }

        DIR = DIR + "/" + _HOMEFOLDER + "/";
        if (!fs.existsSync(DIR)) {
          console.log(_HOMEFOLDER, "Does not exist, creating...")
          fs.mkdirSync(DIR);
        }
      }


      cb(null, DIR)
    },
    filename: function (req, file, cb) {
      const DB = validateDB(req);
      const _APP = req.headers['app'];

      if (_APP == 'logo') cb(null,'logo.img');
      if (_APP == 'sign') cb(null,'sign.img');

      if (_APP == 'dovela') {
        var name = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
        var extension = file.originalname.split('.').pop();
        cb(null, name + '-' + Date.now() + '.' + extension);
      }

    }
  })
  return storage;
}

exports.verify = (files, accept) => {
  files.map(file => {
    var mimetype = file.mimetype;
    if (!accept.includes(mimetype)) {
      fs.unlink(file.path, (err) => {
        console.log('FILE NOT COMPATIBLE, DETELED!');
        if (err) {
          console.log('ATTEMPTING TO DELETE FILE, NOT POSSIBLE: ' + err);
        }
      });
      res.send('ERROR_FILE_NO_ACCEPT');
    }
  })
}

exports.remove = (DB, name, path) => {
  let tryRemove = _remove(name, path);

  if (tryRemove) return true;
  else {
    const _fileInfo = name.split('_');

    const _ORGPATH = __docsdir + "/" + DB.name + "/";
    const _HOMEPATH = _fileInfo[0];
    const _CURRENTYEAR = _fileInfo[1];
    const _HOMEFOLDER = _fileInfo[2];

    path = _ORGPATH + "/" + _HOMEPATH + "/" + _CURRENTYEAR + "/" + _HOMEFOLDER + "/";

    tryRemove = _remove(name, path);
    if (tryRemove) return true;
    else return false;
  }

  function _remove(_name, _path) {
    fs.unlink(_path + "/" + _name, (err) => {
      if (err) {
        console.log('ATTEMPTING TO DELETE FILE, NOT POSSIBLE: ' + err);
        return false;
      }
    });
    return true;
  }

}