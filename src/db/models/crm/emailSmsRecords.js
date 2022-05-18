module.exports = (sequelize, DataTypes) => {
  const EmailSmsRecord = sequelize.define(
    'EmailSmsRecord',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      campaignId: {
        type: DataTypes.UUID,
      },
      message: {
        type: DataTypes.TEXT,
      },
      recipients: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      isScheduled: {
        type: DataTypes.BOOLEAN,
      },
      scheduledTime: {
        type: DataTypes.DATE,
      },
      timezone: {
        type: DataTypes.STRING,
      },
      meta: {
        type: DataTypes.JSON,
      },
      status: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
    },
    {},
  );

  EmailSmsRecord.associate = function (models) {
    EmailSmsRecord.belongsTo(models.Campaign, {
      foreignKey: 'campaignId',
    });
  };

  return EmailSmsRecord;
};
