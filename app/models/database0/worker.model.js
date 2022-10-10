module.exports = (sequelize, Sequelize) => {
    const Workers = sequelize.define("workers", {
        signature: {
          type: Sequelize.STRING
        },
        concent: {
          type: Sequelize.BOOLEAN
        },
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
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
      
      return Workers;
    };