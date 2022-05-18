module.exports = (sequelize, DataTypes) => {
  const CartProduct = sequelize.define(
      'CartProduct',
      {
          id: {
              type: DataTypes.UUID,
              primaryKey: true,
              defaultValue: DataTypes.UUIDV4,
              allowNull: false,
          },
          productId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          cartId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          quantity: {
            type: DataTypes.INTEGER,
          },
          amount: {
            type: DataTypes.DOUBLE,
          },
      },
      {}
  );
  CartProduct.associate = function (models) {
      CartProduct.belongsTo(models.Cart, {
          foreignKey: 'cartId',
      });
  };
  CartProduct.associate = function (models) {
    CartProduct.belongsTo(models.Product, {
        foreignKey: 'productId',
    });
};

  return CartProduct;
};
