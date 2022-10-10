module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
      name: {
        type: Sequelize.STRING
      },
      name_2: {
        type: Sequelize.STRING
      },
      surname: {
        type: Sequelize.STRING
      },
      surname_2: {
        type: Sequelize.STRING
      },
      userInfo: {
        type: Sequelize.JSON
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      name_agent: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      id_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'users_id_number_index',
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
    
    return Users;
  };