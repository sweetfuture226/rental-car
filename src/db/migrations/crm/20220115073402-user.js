module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'Users',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        avatar: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
        },
        firstName: {
          type: Sequelize.STRING,
        },
        lastName: {
          type: Sequelize.STRING,
        },
        address: {
          type: Sequelize.STRING,
      },
      city: {
          type: Sequelize.STRING,
      },
      state: {
          type: Sequelize.STRING,
      },
      country: {
          type: Sequelize.STRING,
      },
      postalCode: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
