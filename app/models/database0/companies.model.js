module.exports = (sequelize, Sequelize) => {
    const Companies = sequelize.define("companies", {
        name: {
            type: Sequelize.STRING
        },
        companyInfo: {
            type: Sequelize.JSON
        },
        bdname: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        technicalInfo: {
            type: Sequelize.JSON
        },
        id_public: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'company_id_public',
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
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

    return Companies;
};