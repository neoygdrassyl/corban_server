module.exports = {

  "users": {

    "databases": {
      // MAIN DATA BASE OF CORBAN
      "Database0": {     
        "database": process.env.RDS_DATABASE0,
        "username": process.env.RDS_USERNAME0,
        "password": process.env.RDS_PASSWORD0,
        "host": process.env.RDS_HOSTNAME0,
        "port": process.env.RDS_PORT0,
        'dialect': process.env.RDS_DIALECT0,
        'pool': {
          'max': 5,
          'min': 0,
          'acquire': 30000,
          'idle': 10000
        }
      },
    }
  },

  // DATA BASES OF THE TEAMS
  "databases": process.env.RDS_DATABASE.split(' ').map((db, i) => {
    return {
      "name": process.env.RDS_NAME.split(' ')[i],
      "database": process.env.RDS_DATABASE.split(' ')[i],
      "username": process.env.RDS_USERNAME.split(' ')[i],
      "password": process.env.RDS_PASSWORD.split(' ')[i],
      "host": process.env.RDS_HOSTNAME.split(' ')[i],
      "port": process.env.RDS_PORT.split(' ')[i],
      'dialect': process.env.RDS_DIALECT.split(' ')[i],
      'pool': {
        'max': 5,
        'min': 0,
        'acquire': 30000,
        'idle': 10000
      }
    }
  }),

};