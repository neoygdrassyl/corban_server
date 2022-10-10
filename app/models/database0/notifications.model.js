module.exports = (sequelize, Sequelize) => {
    const Notifications = sequelize.define("notifications", {
        date: {
          type: Sequelize.DATE
        },
        check: {
          type: Sequelize.BOOLEAN
        },
        title: {
          type: Sequelize.STRING
        },
        notifInfo: {
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
      
      return Notifications;
    };