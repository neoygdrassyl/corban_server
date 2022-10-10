module.exports = (sequelize, Sequelize) => {
    const Sessions = sequelize.define("sessions", {
        event: {
            type: Sequelize.STRING
        },
        sessionInfo: {
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

    return Sessions;
};