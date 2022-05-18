module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
      'AdminApplications',
      {
          id: {
              type: Sequelize.UUID,
              primaryKey: true,
              defaultValue: Sequelize.UUIDV4,
              allowNull: false,
          },
          applicationId: {
              type: Sequelize.UUID,
          },
          adminId: {
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
          meta: {
              type: Sequelize.JSON,
          },
      },
      {
          freezeTableName: true,
      }
  ),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('AdminApplications'),
};
