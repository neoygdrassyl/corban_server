module.exports = (sequelize, Sequelize) => {
    const Record_Law = sequelize.define("record_law", {
      id_public: {
        type: Sequelize.STRING,
      },
      version: {
        type: Sequelize.INTEGER,
      },
      worker_name: {
        type: Sequelize.STRING,
      },
      worker_id: {
        type: Sequelize.INTEGER,
      },
      date_asign: {
        type: Sequelize.DATEONLY,
      },
      worker_prev: {
        type: Sequelize.INTEGER,
      },
      binnacle: {
        type: Sequelize.STRING(4096),
      },
      createdAt: {
        type: 'TIMESTAMP(0)',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: 'TIMESTAMP(0)',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  
    return Record_Law;
  };