module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
      'RolePermission',
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          unique: true,
      },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      permissionId: {
          type: DataTypes.UUID,
          allowNull: false,
      },
      },
      {}
  );
  RolePermission.associate = function (models) {
      RolePermission.belongsTo(models.Role, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE',
      });
      RolePermission.belongsTo(models.Permission, {
        foreignKey: 'permissionId',
        onDelete: 'CASCADE',
    });
  };

  return RolePermission;
};
