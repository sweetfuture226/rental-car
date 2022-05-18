module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
      'UIContents',
      {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        resource: {
            type: Sequelize.STRING,
        },
        page: {
            type: Sequelize.STRING,
        },
        type: {
            type: Sequelize.STRING,
        },
        content: {
            type: Sequelize.JSON,
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
        }
      },
      {
          freezeTableName: true,
      }
  ),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Otps'),
};
