module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'Orders',
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
        addressId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        amount: {
          type: Sequelize.DOUBLE,
        },
        quantity: {
          type: Sequelize.INTEGER,
        },
        status: {
          type: Sequelize.STRING, // 'pending', 'processing', 'completed', 'cancelled'
        },
        isPaid: {
          type: Sequelize.BOOLEAN,
        },
        paymentRef: {
          type: Sequelize.STRING,
        },
        meta: {
          type: Sequelize.JSON,
        },
        expectedDeliveryDate: {
          type: Sequelize.DATE,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Orders'),
};
