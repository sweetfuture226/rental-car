module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
      'Role',
      {
          name: {
              type: DataTypes.STRING,
              allowNull: false,
              unique: true,
          },
          applicationId: {
                type: DataTypes.UUID,
          },
          createdBy: {
            type: DataTypes.UUID,
        },
         updatedBy: {
            type: DataTypes.UUID,
          }
      },
      {}
  );
  Role.associate = function (models) {
      Role.hasMany(models.Admin, {
          foreignKey: 'roleId'
      });
      Role.hasMany(models.RolePermission, {
        foreignKey: 'roleId'
    });
  };

  return Role;
};
