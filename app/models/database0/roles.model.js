module.exports = (sequelize, Sequelize) => {
    const Roles = sequelize.define("roles", {
      name: {
        type: Sequelize.STRING
      },
      roleInfo: {
        type: Sequelize.STRING
      },
      permits: {
        type: Sequelize.JSON,
      },
      priority: {
        type: Sequelize.INTEGER
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
  
    return Roles;
  };