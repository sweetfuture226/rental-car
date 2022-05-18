'use strict';

module.exports = (sequelize, DataTypes) => {
  const AdminApplication = sequelize.define(
    'AdminApplication',
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
      adminId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {}
  );
  AdminApplication.associate = function (models) {
      AdminApplication.belongsTo(models.Admin, {
        foreignKey: 'adminId',
        as: 'admins'
      });
      AdminApplication.belongsTo(models.Application, {
        foreignKey: 'applicationId',
        as: 'applications'
      });
  };

  return AdminApplication;
};