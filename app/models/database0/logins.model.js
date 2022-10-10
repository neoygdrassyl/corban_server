module.exports = (sequelize, Sequelize) => {
    const Logins = sequelize.define("logins", {
        loginUser: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'logins_email_index',
        },
        passwordSalt: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        passwordHash: {
            type: Sequelize.STRING(512),
            allowNull: false,
        },
        verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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

    return Logins;
};