module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'StoreOrders',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        orderId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        storeId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        productId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        unitAmount: {
          type: Sequelize.DOUBLE,
        },
        totalAmount: {
          type: Sequelize.DOUBLE,
        },
        quantity: {
          type: Sequelize.INTEGER,
        },
        status: {
          type: Sequelize.STRING, // 'pending', 'processing', 'completed', 'cancelled', 'in-transit', 'delivered', 'returned', 'refunded', 'failed'
        },
        meta: {
          type: Sequelize.JSON,
        },
        expectedDeliveryDate: {
          type: Sequelize.DATE,
        },
        isSettled: {
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
      },
    ),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('StoreOrders'),
};
