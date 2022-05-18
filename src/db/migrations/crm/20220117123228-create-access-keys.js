module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'AccessKeys',
        {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
            },
            entityId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            entityType: {
                type: Sequelize.STRING,
            },
            key: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('AccessKeys'),
};
