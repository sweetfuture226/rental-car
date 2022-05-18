'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserApplication = sequelize.define(
    'UserApplication',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      applicationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: true,
      }
    },
    {}
  );
  UserApplication.associate = function (models) {
      UserApplication.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      UserApplication.belongsTo(models.Application, {
        foreignKey: 'applicationId',
      });
  };

  return UserApplication;
};