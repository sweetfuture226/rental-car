module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define(
      'Organization',
      {
          id: {
              type: DataTypes.UUID,
              primaryKey: true,
              defaultValue: DataTypes.UUIDV4,
              allowNull: false,
              unique: true,
          },
          name: {
              type: DataTypes.STRING,
              unique: true,
          },
          description: {
              type: DataTypes.STRING,
          },
        ownerId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
      },
      {}
  );
  Organization.associate = function (models) {
      Organization.hasMany(models.AdminOrganization, {
          foreignKey: 'organizationId',
      });
  };

  return Organization;
};
