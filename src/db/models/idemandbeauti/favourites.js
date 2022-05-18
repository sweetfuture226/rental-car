module.exports = (sequelize, DataTypes) => {
  const Favourite = sequelize.define(
      'Favourite',
      {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        storeId: {
          type: DataTypes.UUID,
        },
        productId: {
          type: DataTypes.UUID,
        },
      },
      {}
  );
  Favourite.associate = function (models) {
      Favourite.belongsTo(models.Store, {
          foreignKey: 'storeId',
      });
      Favourite.belongsTo(models.Product, {
        foreignKey: 'productId',
    });
  };

  return Favourite;
};
