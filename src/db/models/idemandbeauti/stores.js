module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define(
      'Store',
      {
          id: {
              type: DataTypes.UUID,
              primaryKey: true,
              defaultValue: DataTypes.UUIDV4,
              allowNull: false,
          },
          vendorId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          banner: {
            type: DataTypes.STRING,
          },
          address: {
            type: DataTypes.STRING,
          },
          contactEmail: {
            type: DataTypes.STRING,
          },
          contactPhone: {
            type: DataTypes.STRING,
          },
          description: {
            type: DataTypes.STRING,
          },
          openTime: {
            type: DataTypes.STRING,
          },
          closeTime: {
            type: DataTypes.STRING,
        },
        createdBy: {
          type: DataTypes.UUID,
      },
      updatedBy: {
          type: DataTypes.UUID,
      },
      },
      {}
  );
  Store.associate = function (models) {
      Store.hasMany(models.Product, {
          foreignKey: 'storeId',
      });
      Store.hasMany(models.Favourite, {
        foreignKey: 'storeId',
    });
  };

  return Store;
};
