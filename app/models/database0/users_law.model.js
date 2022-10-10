module.exports = (sequelize, Sequelize) => {
    const Users_law = sequelize.define("users_law", {
        name: {
            type: Sequelize.STRING
        },
        agent_name: {
            type: Sequelize.STRING
        },
        agent_surname: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        number: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        web: {
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

    return Users_law;
};