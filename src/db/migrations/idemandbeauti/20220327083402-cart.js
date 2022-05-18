module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'Carts',
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
        totalQuantity: {
          type: Sequelize.INTEGER,
        },
        totalAmount: {
          type: Sequelize.DOUBLE,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Carts'),
};
