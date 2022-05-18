module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
      'Roles',
      {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
          },
          name: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          applicationId: {
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
      }
  ),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Roles'),
};
