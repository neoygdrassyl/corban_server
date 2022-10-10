const db = require("../models");
const BD_Users = db.DBS['Database0'];
var queries = require('../resources/sqlQueries')
const { QueryTypes } = require('sequelize');

// ALL ACTIONS PERFORMED BY AN USER MUST BE CHECKED BEFORE HAND, IF THEY ARE ALLOWED TO DO IT
// THIS IS CHECKED BOTH IN THE FRONT END
// AND (HERE) THE BACK END
// THE CHECK LOOKS FOR AN USER  WIHITN A COMPANY AND SEE IF ANY OF THE BELONGING ROLES THEY HAVE CONTAINS A HIGH ENOUGHT PRIORITY TO CONTINUE THE ACTION
// SEND TRUE IF SO
// SENDS FALSE IF THE ROLES HAVE NOT ENOUGHT PRIORITY


// IF THE PRIORITY IS 11, IT RETURNS TRUE AT ONCE
// PRIORIY 11 IS GIVEN TO SUPER ADMINS

// aimPermitValue

// 0 = no permits
// 1 = view permits
// 2 = create permits
// 3 = edit permits
// 4 = delete permits
// 5 = upload files
// 6 = generate files (pdfs, vsc)

exports.verifyPermit = (req, _permitName, _permitValue) => {

    const dbId = req.headers['dbid'];
    const userId = req.headers['userid'];

    return BD_Users.query(queries.loadWorkerData(dbId, userId), { type: QueryTypes.SELECT })
        .then(data => {

            if (data.length == 0) return false;

            if (data[0].priority.includes('11')) return true;
            if (data[0].priority.includes('10') && (_permitName == 'worker' || _permitName == 'roles' || _permitName == 'ADMIN')) return true;

            if(data[0].active == 0) return false

            let permits = data[0].permits;

            permits = permits.split(';')
          
            for (let i = 0; i < permits.length; i++) {
                const permit = GET_JSON_FULL(permits[i]);
                if(_permitName in permit){
                    if (permit[_permitName].includes(_permitValue)) return true;
                }
            }
            return false;
            
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "ERROR AT VERIFYING PERMIT"
            });
        });
}


function GET_JSON_FULL(objec) {
    if (!objec) return {};
    let json = objec;
    let whileSafeBreaker = 0;
    while (typeof json !== 'object') {
        try {
            json = JSON.parse(json)
        } catch (error) {
            return false;
        }
        whileSafeBreaker++
        if (whileSafeBreaker == 10) return false;
    }
    return json
}