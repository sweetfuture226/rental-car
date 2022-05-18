module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'CartProducts',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        productId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        cartId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        quantity: {
          type: Sequelize.INTEGER,
        },
        amount: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('CartProducts'),
};
