module.exports = (sequelize, Sequelize) => {
    const Mailers = sequelize.define("mailers", {
        subject: {
            type: Sequelize.STRING
        },
        to: {
            type: Sequelize.TEXT
        },
        from: {
            type: Sequelize.STRING
        },
        cc: {
            type: Sequelize.STRING
        },
        bcc: {
            type: Sequelize.STRING
        },
        text: {
            type: Sequelize.TEXT,
        },
        bounce: {
            type: Sequelize.STRING
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

    return Mailers;
};