module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'Payments',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        userId: {
          type: Sequelize.UUID,
        },
        campaignId: {
          type: Sequelize.UUID,
        },
        paymentType: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.STRING,
        },
        paymentId: {
          type: Sequelize.STRING,
        },
        receiptUrl: {
          type: Sequelize.STRING,
        },
        amount: {
          type: Sequelize.DOUBLE,
        },
        processing: {
          type: Sequelize.STRING,
        },
        currency: {
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
      },
    ),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Payments'),
};
