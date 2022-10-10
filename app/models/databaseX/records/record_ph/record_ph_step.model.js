module.exports = (sequelize, Sequelize) => {
    const Record_Ph_Step = sequelize.define("record_ph_step", {
        id_public: {
            type: Sequelize.STRING,
        },
        version: {
            type: Sequelize.INTEGER,
        },
        check: {
            type: Sequelize.STRING,
        },
        value: {
            type: Sequelize.STRING(8128),
        },
        json: {
            type: Sequelize.JSON,
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

    return Record_Ph_Step;
};