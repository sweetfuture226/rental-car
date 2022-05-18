module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'Transactions',
        {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
            },
            amount: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            userId: {
                type: Sequelize.UUID,
            },
            applicationId: {
                type: Sequelize.UUID,
            },
            status: {
                type: Sequelize.STRING,
            },
            transactionReference: {
                type: Sequelize.STRING,
            },
            narration: {
                type: Sequelize.STRING,
            },
            meta: {
                type: Sequelize.JSON,
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('Transactions'),
};
