module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'AdminOrganizations',
        {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                unique: true,
            },
            adminId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            organizationId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            roleId: {
                type: Sequelize.INTEGER,
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('AdminOrganizations'),
};
