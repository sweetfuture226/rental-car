module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
      'Admins',
      {
          id: {
              type: Sequelize.UUID,
              primaryKey: true,
              defaultValue: Sequelize.UUIDV4,
              allowNull: false,
          },
          email: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true,
          },
          firstName: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          lastName: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          phone: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
          roleId: {
            type: Sequelize.INTEGER,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Admins'),
};
