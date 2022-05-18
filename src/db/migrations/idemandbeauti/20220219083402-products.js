module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'Products',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        storeId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        imageUrl: {
          type: Sequelize.STRING,
        },
        price: {
          type: Sequelize.DOUBLE,
        },
        description: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.STRING,
        },
        meta: {
          type: Sequelize.JSON,
      },
      createdBy: {
        type: Sequelize.UUID,
    },
    updatedBy: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Products'),
};
