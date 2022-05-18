module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
      'Otps',
      {
          id: {
              type: Sequelize.UUID,
              primaryKey: true,
              defaultValue: Sequelize.UUIDV4,
              allowNull: false,
          },
          entityId: {
            type: Sequelize.UUID,
            },
            applicationId: {
                type: Sequelize.UUID,
                },
        entityType: {
            type: Sequelize.STRING,
        },
        otp: {
            type: Sequelize.STRING,
        },
        type: {
            type: Sequelize.STRING,
        },
        expiredAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
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
