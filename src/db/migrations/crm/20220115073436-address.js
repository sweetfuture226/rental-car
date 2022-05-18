module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'Addresses',
        {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                unique: true,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            applicationId: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            address: {
                type: Sequelize.STRING,
            },
            city: {
                type: Sequelize.STRING,
            },
            state: {
                type: Sequelize.STRING,
            },
            country: {
                type: Sequelize.STRING,
            },
            postalCode: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
        },
        {
            freezeTableName: true,
        }
    ),
    // eslint-disable-next-line no-unused-vars
    down: (queryInterface, Sequelize) => queryInterface.dropTable('Addresses'),
};
