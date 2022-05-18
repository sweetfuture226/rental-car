module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
      'Permission',
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
          unique: true,
      },
        name: {
          type: DataTypes.STRING,
          unique: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        createdBy: {
          type: DataTypes.UUID,
      },
       updatedBy: {
          type: DataTypes.UUID,
        }
      }
  );
  Permission.associate = function (models) {
      Permission.hasMany(models.RolePermission, {
          foreignKey: 'permissionId'
      });
  };

  return Permission;
};
