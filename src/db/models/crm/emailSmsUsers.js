'use strict';

module.exports = (sequelize, DataTypes) => {
  const EmailSmsUser = sequelize.define(
    'EmailSmsUser',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      emailSmsId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {},
  );
  EmailSmsUser.associate = function (models) {
    EmailSmsUser.belongsTo(models.User, {
      as: 'lead',
      foreignKey: 'userId',
    });
    EmailSmsUser.belongsTo(models.EmailSmsRecord, {
      foreignKey: 'emailSmsId',
    });
  };

  return EmailSmsUser;
};
