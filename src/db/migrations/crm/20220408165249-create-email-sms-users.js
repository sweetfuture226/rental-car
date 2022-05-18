module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'EmailSmsUsers',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        emailSmsId: {
          type: Sequelize.UUID,
        },
        userId: {
          type: Sequelize.UUID,
        },
        email: {
          type: Sequelize.STRING,
        },
        phone: {
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
        meta: {
          type: Sequelize.JSON,
        },
      },
      {
        freezeTableName: true,
      },
    ),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable('EmailSmsUsers'),
};
