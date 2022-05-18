module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'Favourites',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        storeId: {
          type: Sequelize.UUID,
        },
        productId: {
          type: Sequelize.UUID,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Favourites'),
};
