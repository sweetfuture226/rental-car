'use strict';

module.exports = (sequelize, DataTypes) => {
  const AdminOrganization = sequelize.define(
    'AdminOrganization',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      adminId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
      },
    },
    {}
  );
  AdminOrganization.associate = function (models) {
      AdminOrganization.belongsTo(models.Admin, {
        foreignKey: 'adminId',
        as: 'admins'
      });
      AdminOrganization.belongsTo(models.Organization, {
        foreignKey: 'organizationId',
        as: 'applications'
      });
  };

  return AdminOrganization;
};