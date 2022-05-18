module.exports = {
    up: (queryInterface, Sequelize) =>
      queryInterface.createTable(
        'OptionalUserValues',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
          },
        phone: {
            type: Sequelize.STRING,
        },
        key: {
            type: Sequelize.STRING,
        },
        value: {
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('OptionalUserValues'),
  };
  