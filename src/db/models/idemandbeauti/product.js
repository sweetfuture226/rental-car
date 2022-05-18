module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
      'Product',
      {
          id: {
              type: DataTypes.UUID,
              primaryKey: true,
              defaultValue: DataTypes.UUIDV4,
              allowNull: false,
          },
          storeId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          name: {
            type: DataTypes.STRING,
          },
          imageUrl: {
            type: DataTypes.STRING,
          },
          price: {
            type: DataTypes.DOUBLE,
          },
          description: {
            type: DataTypes.STRING,
          },
          status: {
            type: DataTypes.STRING,
          },
          meta: {
            type: DataTypes.JSON,
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
  Product.associate = function (models) {
      Product.belongsTo(models.Store, {
          foreignKey: 'storeId',
      });
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
    });
      Product.hasMany(models.Favourite, {
        foreignKey: 'productId',
      });
  };

  return Product;
};
