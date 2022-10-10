module.exports = (sequelize, Sequelize) => {
    const Accounts = sequelize.define("accounts", {
        name: {
          type: Sequelize.STRING
        },
        planLevel: {
          type: Sequelize.STRING
        },
        active: {
          type: Sequelize.BOOLEAN
        },
        accountInfo: {
          type: Sequelize.JSON
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
      
      return Accounts;
    };