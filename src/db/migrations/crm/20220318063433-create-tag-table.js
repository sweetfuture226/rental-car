module.exports = {
    up: (queryInterface, Sequelize) =>
      queryInterface.createTable(
        'Tags',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
          },
        name: {
            type: Sequelize.STRING,
            unique: true,
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('Tags'),
  };
  