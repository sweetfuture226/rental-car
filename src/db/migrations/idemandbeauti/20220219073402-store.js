module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'Stores',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        vendorId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        banner: {
          type: Sequelize.STRING,
        },
        address: {
          type: Sequelize.STRING,
        },
        contactEmail: {
          type: Sequelize.STRING,
        },
        contactPhone: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING,
        },
        openTime: {
          type: Sequelize.STRING,
        },
        closeTime: {
          type: Sequelize.STRING,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Stores'),
};
