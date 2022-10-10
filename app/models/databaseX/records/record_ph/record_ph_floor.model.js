module.exports = (sequelize, Sequelize) => {
    const Record_Ph_Floor = sequelize.define("record_ph_floor", {
        floor: {
            type: Sequelize.STRING,
        },
        
        division: {
            type: Sequelize.STRING(512),
        },
        division_build: {
            type: Sequelize.STRING,
        },
        division_free: {
            type: Sequelize.STRING,
        },

        common: {
            type: Sequelize.STRING,
        },
        fixed: {
            type: Sequelize.STRING,
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

    return Record_Ph_Floor;
};