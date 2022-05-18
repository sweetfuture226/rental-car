module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'Campaigns',
        {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING,
                unique: true,
            },
            description: {
                type: Sequelize.STRING,
            },
            slug: {
                type: Sequelize.STRING,
                unique: true,
            },
            type: {
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('Campaigns'),
};
