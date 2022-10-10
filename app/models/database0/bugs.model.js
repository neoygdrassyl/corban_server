module.exports = (sequelize, Sequelize) => {
    const Bugs = sequelize.define("bugs", {
        reporter: {
            type: Sequelize.STRING
        },
        product: {
            type: Sequelize.STRING
        },
        priority: {
            type: Sequelize.INTEGER
        },
        browser: {
            type: Sequelize.STRING
        },
        url: {
            type: Sequelize.STRING
        },
        desc: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.STRING
        },
        history: {
            type: Sequelize.TEXT
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

    return Bugs;
};