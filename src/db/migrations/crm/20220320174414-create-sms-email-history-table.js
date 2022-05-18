module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'EmailSmsRecords',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        campaignId: {
          type: Sequelize.UUID,
        },
        message: {
          type: Sequelize.TEXT,
        },
        recipients: {
          type: Sequelize.ARRAY(Sequelize.STRING),
        },
        isScheduled: {
          type: Sequelize.BOOLEAN,
        },
        scheduledTime: {
          type: Sequelize.DATE,
        },
        timezone: {
          type: Sequelize.STRING,
        },
        meta: {
          type: Sequelize.JSON,
        },
        status: {
          type: Sequelize.STRING,
        },
        type: {
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
  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable('EmailSmsRecords'),
};
