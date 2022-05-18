module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
      'Cart',
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
          totalQuantity: {
            type: DataTypes.INTEGER,
          },
          totalAmount: {
            type: DataTypes.DOUBLE,
          },
      },
      {}
  );

  Cart.associate = function (models) {
    Cart.hasMany(models.CartProduct, {
        foreignKey: 'cartId',
    });
};

  return Cart;
};
