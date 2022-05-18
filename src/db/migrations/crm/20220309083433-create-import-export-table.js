module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'Documents',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        adminId: {
          type: Sequelize.UUID,
        },
        documentUrl: {
          type: Sequelize.STRING,
        },
        meta: {
          type: Sequelize.JSON,
        },
        status: {
          type: Sequelize.STRING,
        },
        progress: {
          type: Sequelize.INTEGER,
        },
        deliveryMethod: {
          type: Sequelize.STRING,
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
      },
    ),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Documents'),
};
